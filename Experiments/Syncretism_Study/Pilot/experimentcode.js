/*
If your stims have specific blocks, set to true

If set to true, stims.csv must contain column called "block"
*/
const blocks = true;
const numBlocks = 5;
const studyDurationMinutes = 35;
const isLocalTest = false;

// initialize jsPsych
var jsPsych = initJsPsych({
    show_progress_bar: true,
    auto_update_progress_bar: true, //update automatically with each trial
    message_progress_bar: "Progreso",
    on_finish: function () {
        jsPsych.data.displayData(); // optional
    }
});

// Load stimuli
Papa.parse("stimuli/stims.csv", {
    download: true,
    header: true,
    complete: function (results) {
        stimuli = results.data;
        // stimuli = jsPsych.randomization.shuffle(stimuli);
        console.log(stimuli);

        startExperiment();
    }
});


// Generate random name for participant and datafile
const subject_id = jsPsych.randomization.randomID(10);
const filename = `${subject_id}.csv`;

// Main function that creates slides and runs experiment
async function startExperiment() {

    /*
    Generate Conditions
    */
    let condition;
    if (isLocalTest) {
        condition = 0;
    } else {
        condition = await jsPsychPipe.getCondition("PrpZZxouPWGR");
        // Datapipe assigns conditions: 0 and 1
    }

    console.log("Condition:" + condition)
    jsPsych.data.addProperties({
        condition: condition,
    });
    
    // main timeline
    var timeline = [];

    // welcome and consent
    var Welcome_page = {
        type: jsPsychHtmlButtonResponse,
        stimulus: `
        <p>En este estudio verá varias palabras. Tendrá que responder si las palabras son reales o no, es decir, si pertenecen al idioma español o no. El estudio durará aproximadamente <span class='studyDuration'>${studyDurationMinutes}</span> minutos. Si quiere participar por favor lea la autorización y pulse el botón “estoy de acuerdo”. </p>

        <embed src="consent.pdf#pagemode=none&navpanes=0" type="application/pdf" width="100%" height="600" style="max-width: 100%;" />
        `,
        choices: ["Estoy de Acuerdo"]
    };

    var Practice_Intro_page = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: `
        <div style="text-align: left; margin-bottom: 0; margin-top: -50px;">
        <p> Va a ver varias palabras en los próximos ~<span class='studyDuration'>${studyDurationMinutes}</span> minutos. <br> <br>
        
        Cuando vea cada palabra, lo más rápido y preciso como le sea posible decida si la palabra es: <br>
        </p>
        <p>
            <ul>
            <li> <b> Una palabra real </b></li>
            <p> Una palabra real en Español <br>
            <b> Pulse la tecla J</b> usando el dedo índice derecho </p>
            <li> <b> Una palabra sin sentido </b> </li>
            <p> Cualquier palabra que no es una palabra real en Español (puede parecer una palabra real como “escuelo” o puede no parecer a ninguna palabra real como “macepero”) <br>
            <b> Pulse la tecla F</b> con el dedo índice izquierdo </p>
            </ul>
        </p>
        <p>
        Por favor coloque los dedos índices en las teclas en todo momento, y utilice la mano izquierda para la tecla F y la mano derecha para la tecla J. Es muy importante que intente responder lo más rápido y preciso que pueda. Por favor complete el experimento en una sesión (aproximadamente <span class='studyDuration'>${studyDurationMinutes}</span> minutos); no empiece el experimento si no tiene suficiente tiempo para completarlo. Tendrá seis pausas para descansar un poco. <br><br> </p>
        </div>

        <div class="cntr" style="margin-top: -50px;">
        <p>¡Empezaremos con unos ejemplos de práctica! <br> </p>
            <p>Presione cualquier tecla para continuar.</p>
        </div>
    `,
    };

    // Define slides that will be repeated over and over (fixation cross and blank screen)
    var fixation = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: '<div style="font-size:40px;">+</div>',
        choices: "NO_KEYS",
        trial_duration: 300 //ms that fixation cross is on screen
    };

    var blank = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: ' ',
        choices: "NO_KEYS",
        trial_duration: 300 //ms in between fixation cross and stimulus
    };


    var blankOffset = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: ' ',
        choices: "NO_KEYS",
        trial_duration: 150 //ms in between fixation cross and stimulus
    };

    // Create Practice Trials with correct responses
    const practice_stims = [
        { stimulus: "fumo", correct_response: "j" },
        { stimulus: "rudaba", correct_response: "f" },
        { stimulus: "resultó", correct_response: "j" },
        { stimulus: "remoptaste", correct_response: "f" },
    ];

    // Create array to hold practice trials
    const practice = [];

    // loop through all practice stimuli to create practice trials
    for (let i = 0; i < practice_stims.length; i++) {
        /* 
        For each practice trial, create a [fixation cross, blank page, conditional_loop]
        conditional_loop consists of a normal trial and a feedback page, if the answer is not correct
        the conditional_loop will loop back to through trail - feedback pages until the participant gets
        the answer correct.
        */
        const stimulus = practice_stims[i].stimulus;
        const correct_key = practice_stims[i].correct_response;

        const trial = {
            type: jsPsychHtmlKeyboardResponse,
            stimulus: `<div style="font-size:20pt;">${stimulus}</div>`,
            choices: "ALL_KEYS",
            data: {
                type_of_trial: "practice",
                stimulus: stimulus,
                correct_response: correct_key
            },
            on_finish: function (data) {
                data.correct = data.response === data.correct_response;
            }
        };

        const feedback = {
            type: jsPsychHtmlKeyboardResponse,
            stimulus: function () {
                const last_trial_val = jsPsych.data.get().last(1).values()[0].response;
                const last_trial_correct = jsPsych.data.get().last(1).values()[0].correct;
                if (last_trial_correct) {
                    return "<div style='color: #3b7544;'>¡Correcto!</div>";
                } else if (!["f", "j"].includes(last_trial_val)) {
                    return "<div style='color: #b53131;'> Por favor pulse la tecla 'j' o 'f' </div>";
                } else {
                    return "<div style='color: #b53131;'> Incorrecto. Inténtalo de nuevo.</div>";
                }
            },
            choices: "NO_KEYS",
            trial_duration: 1500
        };

        const conditional_loop = {
            timeline: [trial, feedback],
            loop_function: function (data) {
                const last_response = data.values()[0];
                return !last_response.correct; // repeat if incorrect
            }
        };

        practice.push({
            timeline: [fixation, blank, conditional_loop, blankOffset]
        });
    };

    var mainIntro_page = {
        type: jsPsychHtmlButtonResponse,
        stimulus: `
        <div style="text-align: left;">
            <p>El estudio empezará ahora.</p>

            <p>Para participar de manera eficiente, por favor:</p>
            <ul>
                <li> Maximice la ventana </li>
                <li> Apague su teléfono/notificaciones/música </li>
                <li> Evite distracciones </li>
                <li> Evite pausas no programadas </li>
            </ul>
        </div>
    `,
    choices: ["Empezar"]
    };

    // Function to create the stimulus trials
    function createTrial(stim) {

        let word;
        if (condition == 0) {
            if (Number(stim.list) == 1) {
                word = stim.verb;
            } else {
                word = stim.verb_o;
            }
        } else {
            if (Number(stim.list) == 2) {
                word = stim.verb;
            } else {
                word = stim.verb_o;
            }
        }

        return {
            type: jsPsychHtmlKeyboardResponse,
            stimulus: `<div style="font-size:20pt;">${word}</div>`,
            choices: ["j", "f"],
            data: {
                word: word,
                lemma_inf: stim.verb,
                lemma_o: stim.verb_o,
                lexicality: stim.lexicality,
                type_of_trial: "target",
                correct_response: stim.correct_response,
            },
            on_finish: function (data) {
                // Save RT with an explicit column name in milliseconds.
                data.response_time_ms = data.rt;
                console.log("Item:" + word);
                // console.log("Lexicality:" + stim.lexicality);
                // console.log("lemma:" + stim.verb);
                // console.log("lemma_o:" + stim.verb_o);
                // console.log("correct response: " + stim.correct_response);
                // console.log("Response: " + data.response);
                // console.log("RT (ms): " + data.response_time_ms);
                // update number of correct trials in this block
                if (stim.correct_response == data.response) {
                    n_correct += 1;
                }
            }
        };
    };

    // Array to hold all blocks
    main_trials = [];

    /*
    Break slide

    In order to update the number of correct responses for each block dynamically, this is coded
    as a function, which returns a slide. The function is executed whenever the timeline reaches the break slide

    input: n_counter, number of trials in this block
    */
    function createBreakSlide(n_counter) {
        return {
            type: jsPsychHtmlButtonResponse,
            stimulus: function () {
                return "<p> Ha acertado " + Math.round((n_correct / n_counter) * 100) + "% de las veces</p> <br><p>Puede tomar un descanso.</p><br> <p>Cuando este listo, presione el botón para continuar.";
            },
            choices: ["Continuar"], // User presses space to continue after the break
            on_finish: function (data) {
                // reset counters for next block
                n_correct = 0;
            },
        };
    }



    // Loop through blocks and make trail arrays per block

    n_correct = 0;
    const shuffled_stimuli = jsPsych.randomization.shuffle([...stimuli]);
    const total_trials = shuffled_stimuli.length;
    const base_block_size = Math.floor(total_trials / numBlocks);
    const remainder = total_trials % numBlocks;
    let trial_index = 0;

    for (let block_index = 0; block_index < numBlocks; block_index++) {
        const n_counter = base_block_size + (block_index < remainder ? 1 : 0);
        if (n_counter === 0) {
            continue;
        }

        let block_trials = [];

        for (let j = 0; j < n_counter; j++) {
            const stim = shuffled_stimuli[trial_index];
            const word_trial = createTrial(stim);

            // Skip NA trials (which one that is depends on the list)
            if (condition == 0) {
                if (Number(stim.list) == 2) {
                    // Delete NA
                    if (stim.verb_o == "NA") {
                        trial_index += 1;
                        console.log(stim.verb_o);
                        continue;
                    }
                }
            } else {
                if (Number(stim.list) == 1) {
                    // Delete NA
                    if (stim.verb_o == "NA") {
                        trial_index += 1;
                        console.log(stim.verb_o);
                        continue;
                    }
                }
            }
            
            block_trials.push({
                timeline: [fixation, blank, word_trial, blankOffset]
            });
            trial_index += 1;
        }

        // Add break after every block except the last one
        if (block_index < numBlocks - 1) {
            block_trials.push(createBreakSlide(n_counter));
        }

        main_trials.push(block_trials);
    };

    // Demographics
    var demographics = {
        type: jsPsychSurveyHtmlForm,
        preamble: '<h3>Cuestionario</h3> <p class="info" style="margin:0 0 0px 0;"><br>Por favor, conteste a las siguientes preguntas. Las preguntas marcadas con asterisco son obligatorias.</p>',
        html: `


            <p>Género:*
                <select id="gender" name="gender" required>
                <label><option value=""/></label>
                <label><option value="Male"/>Masculino</label>
                <label><option value="Female"/>Feminino</label>
                <label><option value="Nonbinary"/>No binarie</label>
                <label><option value="Other"/>Otro</label>
                </select>
            </p>

            <p>Edad:* <input type="text" id="age" name="age" required/></p>

            <p>Por favor indique su nivel más alto de educación (o la aproximación Estado Unidense equivalente a un título obtenido en otro país):*
                <select id="education" name="education" required>
                <label><option value=""/></label>
                <label><option value="0"/>Menos que escuela secundaria</label>
                <label><option value="1"/>Escuela secundaria/preparatoria</label>
                <label><option value="2"/>Algo de Universidad</label>
                <label><option value="3"/>Universidad</label>
                <label><option value="4"/>Algo de Escuela Post-Graduado</label>
                </select>
            </p>


            <p>¿Ud. ha tenido un problema de visión durante el estudio?* </p>
            <label><input type="radio"  name="assess" value="No" required/>No</label>
            <label><input type="radio"  name="assess" value="Yes"/>Sí</label>

            <br> <br>
            <p>Por favor indique el número de años que Ud. pasó en cada ambiente lingüístico:*</p>
            <p>Un país donde Español es hablado : <input type="text" id="country" name="country" required/></p>
            <p>Una familia donde Español es hablado : <input type="text" id="family" name="family" required/></p>
            <p>Una escuela y/o ambiente de trabajo donde Español es hablado : <input type="text" id="schoolwork" name="schoolwork" required/></p>
            <br> <br>

            <p>Por favor indique todos los idiomas que conozca en orden de adquisición (su idioma materno primero):* <input type="text" id="otherLanguage" name="otherLanguage" required/></p>

            <p>Por favor indique las culturas con las cuales Ud. se identifica (por ejemplo los Estados Unidos y México):* <input type="text" id="culture" name="culture" required/></p>
            <br>

            <p>¿De todas las palabras <b>reales</b> que ha visto, cual porcentaje (aproximadamente) fueron verbos?</p>
            <div style="display:flex; align-items:center; justify-content:center; gap:12px; max-width:650px; margin:0 auto;">
            <span style="min-width:120px; text-align:right;">Ningunos (0%)</span>
            <input
                type="range"
                id="real_words_verbs_pct"
                name="real_words_verbs_pct"
                min="0"
                max="100"
                step="10"
                value="0"
                style="flex:1;"
            />
            <span style="min-width:120px;">Todos (100%)</span>
            </div>
            <br>

            <p>¿De todas las palabras <b>sin sentido</b> que ha visto, cual porcentaje (aproximadamente) fueron verbos?</p>
            <div style="display:flex; align-items:center; justify-content:center; gap:12px; max-width:650px; margin:0 auto;">
            <span style="min-width:120px; text-align:right;">Ningunos (0%)</span>
            <input
                type="range"
                id="nonsense_words_verbs_pct"
                name="nonsense_words_verbs_pct"
                min="0"
                max="100"
                step="10"
                value="0"
                style="flex:1;"
            />
            <span style="min-width:120px;">Todos (100%)</span>
            </div>
            <br>

            <p>¿Ud. ha encontrado algun problema con el estudio?</p>
            <textarea id="problems" name="problems" rows="2" cols="50"></textarea>

            <p>¿Tiene comentarios sobre el estudio? </p>
            <textarea id="comments" name="comments" rows="3" cols="50"></textarea>
            <br/>

            <p class="err2" style="color:red; display:none;">Por favor responde a las preguntas obligatorias.</p>
            <br><br>
                </div>
                </div>
        </div>
        `,
        button_label: "Continue",
        on_load: function () {
            const form = document.getElementById("jspsych-survey-html-form");
            const errorText = document.querySelector(".err2");

            // Run validation to ensure participants answered required questions
            form.addEventListener("submit", function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault();
                    event.stopImmediatePropagation();
                    errorText.style.display = "block";
                    return;
                }
                errorText.style.display = "none";
            }, true);
        },
        on_finish: function (data) {
            const responses = data.response;
            jsPsych.data.addProperties({
                participant_gender: responses.gender,
                participant_age: responses.age,
                participant_education: responses.education,
                participant_assess: responses.assess,
                participant_country: responses.country,
                participant_family: responses.family,
                participant_schoolwork: responses.schoolwork,
                participant_otherLanguage: responses.otherLanguage,
                participant_culture: responses.culture,
                participant_real_words_verbs_pct: responses.real_words_verbs_pct,
                participant_nonsense_words_verbs_pct: responses.nonsense_words_verbs_pct,
                participant_problems: responses.problems,
                participant_comments: responses.comments
            });


        },
        data: {
            type_of_trial: "survey",
        }
    };

    /* 
    Trial that saves data to osf(datapipe). It will show (in English) "Please wait while data is being saved"

    Comment it out in the timeline below while testing

    Update experiment_id with the experiment id generated for you in datapipe (see readme)
    */
    const save_data = {
        type: jsPsychPipe,
        action: "save",
        experiment_id: "PrpZZxouPWGR", // This is 
        filename: filename,
        data_string: () => jsPsych.data.get().csv()
    };

    /* 
    End screen

    When testing, uncomment the last line to download the csv file locally
    */
    var end = {
        type: jsPsychHtmlButtonResponse,
        stimulus: "<h2>FIN</h2><p>¡Gracias por haber participado! Su código de finalización es: SKFHDGLS</p>",
        choices: [],
        // on_finish: function (data) {
        //     console.log(data);
        // }
        on_load: function() {
            console.log(jsPsych.data);
            jsPsych.data.get().localSave('csv', 'experiment_data.csv');
        }
    };

    /*
    Push all slides to the timeline
    */
    timeline.push(
        Welcome_page,
        Practice_Intro_page,
        practice,
        mainIntro_page,
        main_trials,
        demographics,
        save_data, // comment this out while testing to not save the data
        end);

    // run
    jsPsych.run(timeline);
}

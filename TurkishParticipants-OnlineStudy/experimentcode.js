/*
If your stims have specific blocks, set to true

If set to true, stims.csv must contain column called "block"
*/ 
const blocks = true; 
const numBlocks = 4;

// initialize jsPsych
var jsPsych = initJsPsych({
    show_progress_bar: true, 
    auto_update_progress_bar: true, //update automatically with each trial
    on_finish: function () {
        jsPsych.data.displayData(); // optional
    }
});

// define stimuli variable globally
let stimuli; 

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
function startExperiment() {

    // main timeline
    var timeline = [];

    // welcome and consent
    var Welcome_page = {
        type: jsPsychHtmlButtonResponse,
        stimulus: `
            <p><strong>Deney başlıyor. Lütfen dikkatlice okuyun:</strong></p>
            <p>Önümüzdeki yaklaşık 30 dakika boyunca ekranda bazı sözcükler göreceksiniz.</p>
            <p>Gördüğünüz her sözcüğün Türkçede var olan gerçek bir sözcük olup olmadığına hızlı ve doğru bir şekilde karar verin.</p>
            <p><strong>Lütfen işaret parmaklarınızı her zaman F ve J tuşlarının üzerinde tutun. "F" tuşu için sol elinizi, "J" tuşu için sağ elinizi kullanın.</strong></p> 
            <p><strong>Eğer sözcük, Türkçede varolan gerçek bir sözcük ise:</strong></p>
            <p><strong>Sağ elinizin işaret parmağını kullanarak “J” tuşuna basın.</strong></p>  
            <p><strong>Eğer sözcük Türkçede var olan gerçek bir sözcük değilse (örneğin, gerçek bir kelimeye benzeyebilir "takıştılar" yerine "takıştıler" gibi):</strong></p>
            <p><strong>Sol elinizin işaret parmağını kullanarak "F" tuşuna basın.</strong></p>

            <p>Çalışmayı lütfen tek oturumda tamamlayın. Yeterli zamanınız yoksa başlamayın.</p>
            <p>Deney boyunca kısa molalar vermeniz için dört ara olacaktır.</p>
            <p>Her sözcükten önce ekranda kısa bir süre "+" işareti görünecektir.</p>
            `,
        choices: ["Continue"]
    };

    var Consent_page = {
        type: jsPsychHtmlButtonResponse,
        stimulus: `
            <div style="font-size:15">
      <div class="cntr">
        <h1>RESEARCH INFORMED CONSENT FORM</h1>
        <h2>Turkish Word Recognition Study (IRB-FY2025-10331)</h2>
        INVESTIGATOR(S): Alec Marantz; Stefan Pophristic 
        <br>

        <h3>INVITATION TO BE A PART OF A RESEARCH STUDY</h3>
        You are invited to participate in a research study. This form has information to help you decide whether or not you wish to participate - please review it carefully. Your participation is voluntary. Please ask any questions you have about the study or about this form before deciding to participate.
        
        <h3>PURPOSE OF THE STUDY</h3>
        The purpose of this study is to test what statistical generalizations we use to process complex words in order to understand how the brain and mind stores and computes words in languages like Turkish.

        <h3>ELIGIBILITY TO PARTICIPATE</h3>
        You are eligible to participate in this study if you speak Turkish as a native speaker and are 18 years or older.
        <br>
        You should not participate if you learned Turkish as a second language. 
        <br>
        To determine if you are eligible, we will ask you to complete a questionnaire with your language background.
        
        <h3>DESCRIPTION OF STUDY PROCEDURES</h3>

        If you agree to participate, you will be asked to:
        <ol>
        <li> Read through this consent form and click the button below to agree to participate in this study.</li>
        <li> You will then be redirected to the instructions of the experiment. You will be shown various Turkish words and nonwords and be asked to judge whether they are real or non-real words via button presses. You will begin with a few practice rounds with feedback. This should take no more than a few minutes.</li>
        <li> After the practice, you will proceed to the main task which will be identical to the practice, but without feedback. The task will last approximately 15 minutes.</li>
        <li>After completing the main task, you will receive a questionnaire to fill out about your language background.</li>
        <li> Upon completing the questionnaire you will be redirected to Prolific. You will receive payment via the Prolific platform after the study is fully complete by all participants. </li>
        </ol>

        <h3>RISKS OR DISCOMFORTS</h3>
        This study involves the following risks or discomforts: While there are measures put in place by the researcher to secure data, there is always a risk of a potential breach of confidentiality.
        <br>
        Please tell the researchers if you believe you are harmed from your participation in the study.

        <h3>BENEFITS</h3>
        It is hoped that this study will contribute to knowledge about how words are processed (i.e. understood) in languages that typically have more complex word structures than English.
        <br>
        While there are no direct benefits to the participant, participants will be helping expand our knowledge of how words are processed in languages other than English and will learn more about the study of Neurolinguistics.

        <h3>COMPENSATION</h3> 
        You will receive $5.00 (USD) via Prolific for your participation.
        
        <h3>VOLUNTARY PARTICIPATION</h3>
        Participating in this study is completely voluntary. You may choose not to take part in the study or to stop participating at any time, for any reason, without penalty or negative consequences.
        
        If you withdraw or are withdrawn from the study early, then we will not keep information about you that is already collected.

        <h3>PRIVACY & DATA CONFIDENTIALITY</h3>
        In this study, you may be asked to provide information that could be used to identify you personally. This information will be kept confidential. Only researchers and others that will keep the information confidential (e.g., regulatory agencies or oversight groups) may access information that could personally identify you.

        <i>Future Use of Data</i>
        Information about you collected for this study may be shared with other researchers, used for other research studies, or placed in a data repository. These studies may be similar to this study or completely different. All information that could identify you will be removed before sharing the data or using it for other research studies. We will not ask you for additional permission before sharing the information.

        <h3>ACCESS TO YOUR STUDY INFORMATION</h3>
        We will not give you access to the information that is collected about you in this study.

        <h3>CONTACT INFORMATION</h3>
        
        You are encouraged to ask questions at any time during this study. For information about the study, contact Özlem Öge-Daşdöğen at (212) 998-8387, zg2797@nyu.edu, Stefan Pophristic at (212) 998-7950, sp6961@nyu.edu, or their faculty sponsor, Alec Marantz at (212) 998-7950, ma988@nyu.edu.
        
        If you have questions about your rights as a research participant or if you believe you have been harmed from the research, please contact the NYU Human Research Protection Program at (212)998-4808 or ask.humansubjects@nyu.edu.
        
        <h3>AGREEMENT TO PARTICIPATE</h3>
        By checking below, you are agreeing to participate in this study. Make sure you understand what the study involves before you agree. If you have questions about the study after you agree to participate, you can contact the research team using the information provided above. You may [print/keep] a copy of this form.
        <br>
        <br>
           
    </div>
       `,
        choices: ["I agree to participate in this research study."]
    };

    var Practice_Intro_page = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: `
        <p><strong>Şimdi birkaç uygulama örneği ile başlayacağız.</strong></p>
        <p>Lütfen olabildiğince hızlı ve doğru yanıtlamaya özen gösterin.</p>
        <p><strong>Deneme alıştırmalarına başlamak için herhangi bir tuşa basın.</strong></p>
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


    // Create Practice Trials with correct responses
    const practice_stims = [
        { stimulus: "teyze", correct_response: "j" },
        { stimulus: "beğenilıyor", correct_response: "f" },
        { stimulus: "uzrak", correct_response: "f" },
        { stimulus: "çarpıntıda", correct_response: "j" },
        { stimulus: "kapıcıye",   correct_response: "f" }
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
            stimulus: `<div style="font-size:40px;">${stimulus}</div>`,
            choices: "ALL_KEYS",
            data: {
            type_of_trial: "practice",
            stimulus: stimulus,
            correct_response: correct_key
            },
            on_finish: function(data) {
            data.correct = data.response === data.correct_response;
            }
        };

        const feedback = {
          type: jsPsychHtmlKeyboardResponse,
          stimulus: function () {
            const last = jsPsych.data.get().last(1).values()[0] || {};
            const resp = (last.response || '').toLowerCase();              // katılımcı tuşu
            const isCorrect = !!last.correct;                               // doğru mu
            const expected = (last.correct_response || '').toLowerCase();   // 'f' ya da 'j'
            const word = last.stimulus || last.stim_text || '';

            if (isCorrect) {
              return `<div style="color:#20ad03;">Doğru yanıt verdiniz!</div>`;
            } else if (!['f','j'].includes(resp)) {
              return `<div style="color:#bf2900;">Yalnızca "F" ya da "J" tuşuna basınız. Lütfen tekrar deneyiniz!</div>`;
            } else if (resp == "j" & expected == "f"){
              return '<div style="color:#bf2900;">Yanlış. Bu kelime gerçek bir Türkçe kelime değil. Lütfen F tuşuna basın.</div>'
            } else if (resp == "f" & expected == "j"){
              return '<div style="color:#bf2900;">Yanlış. Bu kelime gerçek bir Türkçe kelime. Lütfen J tuşuna basın.</div>'
            }},
        choices: "NO_KEYS",
        trial_duration: 1500
        } 

        const conditional_loop = {
            timeline: [trial, feedback],
            loop_function: function(data) {
                const last_response = data.values()[0];
                return !last_response.correct; // repeat if incorrect
            }
        };

        practice.push({
            timeline: [fixation, blank, conditional_loop]
        });
    };

    var mainIntro_page = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: `
        <p>Alıştırma bölümünü tamamladınız!</p> 
        <p>Şimdi asıl denemelerin yer aldığı bölüme geçiyoruz. Bu bölümde dört kısa ara verilecektir. Sadece belirtilen zamanlarda mola vermeniz önemlidir. Bu aşamada artık doğru ya da yanlış yanıtlarınızla ilgili geri bildirim verilmeyecektir. Lütfen her sözcüğe mümkün olduğunca <strong>hızlı ve doğru</strong> şekilde yanıt vermeyi sürdürün.</p> 
        <p>Hazırsanız bir tuşa basın.</p>`,
    };


    // Function to create the stimulus trials
    function createTrial(stim) {
        return {
            type: jsPsychHtmlKeyboardResponse,
            stimulus: `<div style="font-size:40px;">${stim.stimulus}</div>`,
            choices: ["j", "f"],
            data: {
                word: stim.stimulus,
                type_of_trial: "target",
                correct_response: stim.correct_response,
            },
            on_finish: function(data) {
                console.log("correct response: " + stim.correct_response);
                console.log("Response: " + data.response);
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
            type: jsPsychHtmlKeyboardResponse,
            stimulus: function() {
                return "<p> Şu ana kadar %" + Math.round((n_correct/n_counter)*100) + " doğru yanıt verdiniz. Kısa bir ara verebilirsiniz! Hazır olduğunuzda herhangi bir tuşa basın. </p>";
            },
            choices: [" "], // User presses space to continue after the break
            on_finish: function (data) {
                // reset counters for next block
                n_correct = 0;  
            },
        };
    }


    // If you have blocks in your experiment, generate main trials for each block
    if (blocks) {

        n_counter = 0;
        n_correct = 0;
        
        let block_trials = [];

        // Loop through stimuli
        for (let i = 0; i < stimuli.length; i++) {

            let stim = stimuli[i];
            let word_trial = createTrial(stim);

            // update counter
            n_counter += 1;

            // Add the trials in blocks
            block_trials.push({
                timeline: [fixation, blank, word_trial]
            });

            // if we are in the last stimulus, don't have a break page:

            if (i === stimuli.length - 1) {
                // randomize order within the block
                block_trials = jsPsych.randomization.shuffle(block_trials);

                // Add this block to the main trials
                main_trials.push(block_trials);
            } else if (i + 1 === stimuli.length || Number(stimuli[i + 1].block) !== Number(stim.block)) {
            
                // Otherwise, if it is not the last stim in the experiment, but is the last stim in the block
                
                // randomize order within the block
                block_trials = jsPsych.randomization.shuffle(block_trials);

                // If it's the last trial in the current block, add the break page
                block_trials.push(createBreakSlide(n_counter));

                // Add this block to the main trials
                main_trials.push(block_trials);

                // empty block trials array to populate for the next block
                block_trials = [];

                // update counter for number of trials in a block
                n_counter = 0;
            };
        };
    } else {
      // If you don't have blocks, make trials based on number of breaks you want

        // Need to add this code
    };

    // Demographics
// Demographics
var demographics = {
  type: jsPsychSurveyHtmlForm,
  preamble: "<h3>Lütfen aşağıdaki bilgileri doldurunuz</h3>",
  html: `
    <p>Cinsiyet:
      <select name="gender" required>
        <option value="" disabled selected>Seçiniz</option>
        <option value="female">Kadın</option>
        <option value="male">Erkek</option>
        <option value="non-binary">İki kategoriden biriyle tanımlanamayan (non-binary)</option>
        <option value="other">Diğer</option>
        <option value="prefer_not_to_say">Belirtmek istemiyorum</option>
      </select>
    </p>

    <p>Yaş: <input name="age" type="number" min="18" step="1" required></p>

    <p>Eğitim durumu:
      <select name="education" required>
        <option value="" disabled selected>Seçiniz</option>
        <option value="elementary_school">İlköğretim</option>
        <option value="high_school">Lise</option>
        <option value="bachelor">Lisans</option>
        <option value="master">Yüksek Lisans</option>
        <option value="phd">Doktora</option>
        <option value="other">Diğer</option>
      </select>
    </p>

    <p>Lütfen bildiğiniz dilleri edinim sırasına göre yazınız
      (ana dilinizi/ana dillerinizi ilk sırada belirtiniz; eşzamanlı iki ana diliniz varsa bunların arasına ‘/’ işareti koyarak yazınız):
      <input name="language_history_ordered" type="text" placeholder="Örn: Türkçe/İngilizce, Almanca">
    </p>

    <p>Günlük hayatta ağırlıklı olarak kullandığınız dili yazınız:
      <input name="dominant_language" type="text" required>
    </p>

    <!-- Aile/ev ortamı -->
    <p>Aile/ev ortamında başka bir dile maruz kaldınız mı?
      <label><input type="radio" name="exp_home_other_langs" value="no"  checked> Hayır</label>
      <label><input type="radio" name="exp_home_other_langs" value="yes"> Evet</label>
    </p>
    <div id="home_years_wrap" style="display:none; margin-left:1rem;">
      Eğer evet ise, yaklaşık kaç yıl bu dile maruz kaldınız?
      <input id="home_years_input" name="exp_home_other_langs_years" type="number" min="0" step="1" disabled>
    </div>

    <!-- Okul/iş ortamı -->
    <p>Okul/iş ortamında başka bir dile maruz kaldınız mı?
      <label><input type="radio" name="exp_school_work_other_langs" value="no"  checked> Hayır</label>
      <label><input type="radio" name="exp_school_work_other_langs" value="yes"> Evet</label>
    </p>
    <div id="school_years_wrap" style="display:none; margin-left:1rem;">
      Eğer evet ise, yaklaşık kaç yıl bu dile maruz kaldınız?
      <input id="school_years_input" name="exp_school_work_other_langs_years" type="number" min="0" step="1" disabled>
    </div>

    <p>Şu anda yaşadığınız ülke:
      <input class="no-autofill-button" name="current_country" type="text"
             autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"
             data-lpignore="true" data-1p-ignore="true" data-form-type="other">
    </p>

    <p>Bu ülkede kaç yıldır yaşıyorsunuz?
      <input id="country_years_input" class="no-autofill-button" name="country_years"
             type="number" min="0" step="1" inputmode="numeric" autocomplete="off"
             placeholder="örn: 3" data-1p-ignore="true" data-lpignore="true"
             data-form-type="other" required> yıl
    </p>

    <p>Deney sırasında herhangi bir sorun yaşadınız mı? <textarea name="issues"></textarea></p>
    <p>Başka bir yorumunuz var mı? <textarea name="comments"></textarea></p>
  `,  // ← BU VİRGÜL ŞART
  on_load: () => {
    // radio YES seçilince “yıl” alanlarını aç/kapat
    function bindToggle(groupName, wrapId, inputId){
      const wrap  = document.getElementById(wrapId);
      const input = document.getElementById(inputId);
      // ŞU HATALILARI SİL: \` ... \`
      // DOĞRUSU: template literal ile normal backtick
      const yes = document.querySelector(`input[name="${groupName}"][value="yes"]`);
      const no  = document.querySelector(`input[name="${groupName}"][value="no"]`);
      function apply(){
        const show = !!(yes && yes.checked);
        wrap.style.display = show ? 'block' : 'none';
        input.disabled = !show;
        input.required = show;
        if (!show) input.value = '';
      }
      yes && yes.addEventListener('change', apply);
      no  && no.addEventListener('change', apply);
      apply();
    }
    bindToggle('exp_home_other_langs', 'home_years_wrap', 'home_years_input');
    bindToggle('exp_school_work_other_langs', 'school_years_wrap', 'school_years_input');
  },
  button_label: "Bitir",
  on_finish: (data) => {
    const resp = data.response || {};
    if (resp.prolific_id) {
      jsPsych.data.addProperties({ prolific_id: resp.prolific_id });
    }
  },
  data: { type_of_trial: "survey" }
};

    /* 
    Trial that saves data to osf(datapipe). It will show (in English) "Please wait while data is being saved"

    Comment it out in the timeline below while testing

    Update experiment_id with the experiment id generated for you in datapipe (see readme)
    */
    const save_data = {
        type: jsPsychPipe,
        action: "save",
        experiment_id: "QNyT7zWGfR8c", // This is 
        filename: filename,
        data_string: ()=>jsPsych.data.get().csv()
    }; 

    /* 
    End screen

    When testing, uncomment the last line to download the csv file locally
    */
    var end = {
        type: jsPsychHtmlButtonResponse,
        stimulus: "<p>Katılımınız için teşekkür ederiz!</p> <p> Deneyi tamamlama kodunuz: C1B9QGKA</p>",
        choices: [],
        on_load: function() {
            console.log(jsPsych.data);
            // jsPsych.data.get().localSave('csv', 'experiment_data.csv');
        }
    };  

    /*
    Push all slides to the timeline
    */
    timeline.push(Consent_page, 
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

  };
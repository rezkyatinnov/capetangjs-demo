/**
 * CapetangJS
 * 
 * A javascript engine for Text to speech using WebSpeech API by rezkyatinnov
 */
(function() {
    var root = this;
    if ('speechSynthesis' in root) {
        console.log('Yeay!! Your browser supports speech synthesis.');
    } else {
        console.log('Oops! Sorry, It seems your browser doesn\'t support speech synthesis.');
    }

    var voiceList = speechSynthesis.getVoices();
    root.speechSynthesis.onvoiceschanged = function(e) {
        voiceList = speechSynthesis.getVoices();
    };

    function Capetang() {
        // Current version.
        var self = this;
        this.VERSION = '0.2.2';
        this.POPULATE_VOICES_TIMEOUT = 1000 * 60 * 4;

        var _DEFAULT_LANG = "en-US";
        var _DEFAULT_VOLUME = 1;
        var _DEFAULT_RATE = 1;
        var _DEFAULT_PITCH = 1;
        var _DEFAULT_VOICE = null;
        var _DEFAULT_CALLBACK = function(event) {};

        var _text = "";
        var _lang = _DEFAULT_LANG;
        var _volume = _DEFAULT_VOLUME;
        var _rate = _DEFAULT_RATE;
        var _pitch = _DEFAULT_PITCH;
        var _voice = null;
        var _lastError = "";
        var _onError = _DEFAULT_CALLBACK;
        var _onStart = _DEFAULT_CALLBACK;
        var _onEnd = _DEFAULT_CALLBACK;
        var _onPaused = _DEFAULT_CALLBACK;
        var _onResume = _DEFAULT_CALLBACK;
        var _onBoundary = _DEFAULT_CALLBACK;
        var _onMark = _DEFAULT_CALLBACK;

        this.getText = function() { return _text; };
        this.setText = function(text) { _text = text; return this; };

        this.getLang = function() { return _lang; };
        this.setLang = function(lang) { _lang = lang; return this; };

        this.getVolume = function() { return _volume };
        this.setVolume = function(volume) { _volume = volume; return this; };

        this.getRate = function() { return _rate };
        this.setRate = function(rate) { _rate = rate; return this; };

        this.getPitch = function() { return _pitch };
        this.setPitch = function(pitch) { _pitch = pitch; return this; };

        this.getVoice = function() { return _voice };
        this.setVoice = function(voice) {
            if (voice.__proto__.constructor.name == 'SpeechSynthesisVoice') {
                _voice = voice;
                return this;
            } else {
                throw "capetang.setVoice() error: voice must be an instance of SpeechSynthesisVoice. get available voice list by accessing capetang.getVoices() or capetang.onVoiceReady()";
            }
        };

        this.getLastError = function() { return _lastError };
        this.setLastError = function(lastError) { _lastError = lastError };

        this.onError = function() { return _onError; };
        this.setOnError = function(onErrorFunc) { _onError = onErrorFunc; return this; };
        this.onStart = function() { return _onStart; };
        this.setOnStart = function(onStartFunc) { _onStart = onStartFunc; return this; };
        this.onEnd = function() { return _onEnd; };
        this.setOnEnd = function(onEndFunc) { _onEnd = onEndFunc; return this; };
        this.onPaused = function() { return _onPaused; };
        this.setOnPaused = function(onPausedFunc) { _onPaused = onPausedFunc; return this; };
        this.onResume = function() { return _onResume; };
        this.setOnResume = function(onResumeFunc) { _onResume = onResumeFunc; return this; };
        this.onBoundary = function() { return _onBoundary; };
        this.setOnBoundary = function(onBoundaryFunc) { _onBoundary = onBoundaryFunc; return this; };
        this.onMark = function() { return _onMark; };
        this.setOnMark = function(onMarkFunc) { _onMark = onMarkFunc; return this; };

        this.initVoice = function() {
            _text = "";
            _voice = _DEFAULT_VOICE;
            _lang = _DEFAULT_LANG;
            _pitch = _DEFAULT_PITCH;
            _rate = _DEFAULT_RATE;
            _volume = _DEFAULT_VOLUME;
            _onError = _DEFAULT_CALLBACK;
            _onStart = _DEFAULT_CALLBACK;
            _onEnd = _DEFAULT_CALLBACK;
            _onPaused = _DEFAULT_CALLBACK;
            _onResume = _DEFAULT_CALLBACK;
            _onBoundary = _DEFAULT_CALLBACK;
            _onMark = _DEFAULT_CALLBACK;
        };

        this.resetDefault = function() {
            _DEFAULT_LANG = 'en-US';
            _DEFAULT_PITCH = 1;
            _DEFAULT_RATE = 1;
            _DEFAULT_VOLUME = 1;
            _DEFAULT_VOICE = null
            _DEFAULT_CALLBACK = function(event) {};
            self.initVoice();
        };

        this.setDefaultLang = function(lang) {
            _DEFAULT_LANG = lang;
            _lang = _DEFAULT_LANG;
        }

        this.setDefaultPitch = function(pitch) {
            _DEFAULT_PITCH = pitch;
            _pitch = pitch;
        }

        this.setDefaultRate = function(rate) {
            _DEFAULT_RATE = rate;
            _rate = rate;
        }

        this.setDefaultVolume = function(volume) {
            _DEFAULT_VOLUME = volume;
            _volume = volume;
        }

        this.setDefaultVoice = function(voice) {
            if (voice.__proto__.constructor.name == 'SpeechSynthesisVoice') {
                _DEFAULT_VOICE = voice;
                _voice = voice;
            } else {
                throw "capetang.setDefaultVoice() error: voice must be an instance of SpeechSynthesisVoice. get available voice list by accessing capetang.getVoices() or capetang.onVoiceReady()";
            }
        }
    };

    Capetang.prototype.speak = function(text) {
        var self = this;
        var msg = new SpeechSynthesisUtterance();

        if (text == null || text == undefined) {
            msg.text = self.getText();
        } else {
            msg.text = text;
        }
        msg.lang = self.getLang();

        msg.volume = parseFloat(self.getVolume());
        msg.rate = parseFloat(self.getRate());
        msg.pitch = parseFloat(self.getPitch());

        msg.onerror = self.onError();
        msg.onstart = self.onStart();
        msg.onend = self.onEnd();
        msg.onboundary = self.onBoundary();
        msg.onmark = self.onMark();
        msg.onpause = self.onPaused();
        msg.onresume = self.onResume();

        var voice = self.getVoice();
        if (voice != null) {
            msg.voice = voice;
        }

        root.speechSynthesis.speak(msg);
        self.initVoice();
    };

    Capetang.prototype.onVoicesReady = function(callback) {
        var self = this;
        var i = 0;
        var voicereadylistener = root.setInterval(function() {
            if (!(voiceList == null || voiceList.length == 0)) {
                callback(root.speechSynthesis.getVoices());
                root.clearInterval(voicereadylistener);
            } else if (i >= self.POPULATE_VOICES_TIMEOUT) {
                callback(voiceList);
                root.clearInterval(voicereadylistener);
            }
            i = i + 1000;
        }, 1000);
    }

    Capetang.prototype.setVoiceByName = function(name) {
        var self = this;
        var voices = root.speechSynthesis.getVoices().filter(function(voice) {
            return voice.name == name;
        });

        if (voices != null && voices.length > 0) {
            self.setVoice(voices[0]);
        }
        return this;
    }

    Capetang.prototype.getVoicesByName = function(name) {
        var voices = root.speechSynthesis.getVoices().filter(function(voice) {
            return voice.name == name;
        });

        if (voices != null && voices.length > 0) {
            return voices;
        }
        return [];
    }

    Capetang.prototype.getVoicesByLang = function(lang) {
        var voices = root.speechSynthesis.getVoices().filter(function(voice) {
            return voice.lang == lang;
        });

        if (voices != null && voices.length > 0) {
            return voices
        }
        return [];
    }

    Capetang.prototype.getAvaliableLang = function(lang) {
        var langs = root.speechSynthesis.getVoices().map(function(voice) {
            return voice.lang;
        });

        if (langs != null && langs.length > 0) {
            return langs;
        }
        return [];
    }

    Capetang.prototype.getVoices = function() {
        return root.speechSynthesis.getVoices();
    };

    Capetang.prototype.setOnVoicesListChangedListener = function(onVoicesListChangedListener) {
        root.speechSynthesis.onvoiceschanged = onVoicesListChangedListener;
    }

    Capetang.prototype.cancel = function() {
        root.speechSynthesis.cancel();
    };

    Capetang.prototype.pause = function() {
        root.speechSynthesis.pause();
    };

    Capetang.prototype.resume = function() {
        root.speechSynthesis.resume();
    };

    Capetang.prototype.isSpeaking = function() {
        return root.speechSynthesis.speaking;
    };

    Capetang.prototype.hasPending = function() {
        return root.speechSynthesis.pending;
    };

    Capetang.prototype.isPaused = function() {
        return root.speechSynthesis.paused;
    };

    root.capetang = new Capetang();
}).call(this);
import React, { useState, useEffect } from 'react';
import NavBar from "components/NavBar";
import BannerStartHome from "components/BannerStartHome";
import FooterClient from "components/FooterClient";
import { Piano } from 'react-piano';
import 'react-piano/dist/styles.css';

function Index() {
    const [audioContext, setAudioContext] = useState(null);
    const [pianoActiveNotes, setPianoActiveNotes] = useState([]);
    const [xylophoneActiveNotes, setXylophoneActiveNotes] = useState([]);

    // Create audio context on component mount
    useEffect(() => {
        const context = new (window.AudioContext || window.webkitAudioContext)();
        setAudioContext(context);
        return () => context.close(); // Clean up to close the context when the component unmounts
    }, []);

    const noteMapping = {
      C4: 60,
      'C#4': 61,
      D4: 62,
      'D#4': 63,
      E4: 64,
      F4: 65,
      'F#4': 66,
      G4: 67,
      'G#4': 68,
      A4: 69,
      'A#4': 70,
      B4: 71,
    };

    const midiNumberToFrequency = (midiNumber) => {
        return 440 * Math.pow(2, (midiNumber - 69) / 12);
    };
    const playNote = (note, instrument) => {
      const midiNumber = noteMapping[note];
      if (midiNumber === undefined) {
          console.error('Invalid note:', note);
          return;
      }
      const frequency = midiNumberToFrequency(midiNumber);
      if (!isFinite(frequency)) {
          console.error('Non-finite frequency calculated:', frequency);
          return;
      }
      const oscillator = audioContext.createOscillator();
      // Choose the oscillator type based on the instrument
      if (instrument === 'piano') {
          oscillator.type = 'sine';  // Sine wave for piano
      } else if (instrument === 'xylophone') {
          oscillator.type = 'triangle';  // Square or triangle wave for xylophone
      }
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      oscillator.connect(audioContext.destination);
      oscillator.start();
      setTimeout(() => {
          oscillator.stop();
          if (instrument === 'piano') {
              setPianoActiveNotes([]);
          } else {
              setXylophoneActiveNotes([]);
          }
      }, 300); // Stop the note after 300ms
      if (instrument === 'piano') {
          setPianoActiveNotes([midiNumber]);
      } else {
          setXylophoneActiveNotes([midiNumber]);
      }
  };
  
    const stopNote = (instrument) => {
        if (instrument === 'piano') {
            setPianoActiveNotes([]);
        } else {
            setXylophoneActiveNotes([]);
        }
    };

    // Function to convert MIDI number to note name
    const midiNumberToNoteName = (midiNumber) => {
        const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        const octave = Math.floor((midiNumber - 12) / 12);
        const noteIndex = midiNumber % 12;
        return noteNames[noteIndex] + octave;
    };

    return (
        <>
            <NavBar />
            <main>
                <BannerStartHome
                    title="Contact us"
                    description="We're here to help!"
                />
                <h1>Try Piano Game</h1>
                <Piano
                    noteRange={{ first: 60, last: 71 }}
                    width={600}
                    playNote={(midiNumber) => playNote(midiNumberToNoteName(midiNumber), 'piano')}
                    stopNote={() => stopNote('piano')}
                    disabled={false}
                    activeNotes={pianoActiveNotes}
                />
                <h2>Try Xylophone</h2>
                <div className="xylophone">
                    {Object.keys(noteMapping).map(note => (
                        <div key={note} className="key" style={{ backgroundColor: `hsl(${(noteMapping[note] - 60) * 30}, 75%, 60%)` }} onClick={() => playNote(note, 'xylophone')}>
                            {note}
                        </div>
                    ))}
                </div>
            </main>
            <FooterClient />
            <style jsx>{`
                .xylophone {
                    display: flex;
                    justify-content: center;
                    margin-top: 20px;
                }
                .key {
                    width: 60px;
                    height: 200px;
                    margin: 5px;
                    border: 2px solid black;
                    border-radius: 10px;
                    cursor: pointer;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    color: white;
                    font-weight: bold;
                }
                .key:hover {
                    opacity: 0.9;
                }
            `}</style>
        </>
    );
}

export default Index;

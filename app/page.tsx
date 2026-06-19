"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Calendar } from "@/components/ui/calendar"; // Import Calendar

export default function Home() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedSlot, setSelectedSlot] = useState("");
  const [step, setStep] = useState(1);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [negativeError, setNegativeError] = useState("");
  const [disagreedItem, setDisagreedItem] = useState("");
  const [disagreeMessages, setDisagreeMessages] = useState<Record<string, string>>({});

  const allowedNames = [
    { first: "sam", last: "mortazavi" },
    { first: "amin", last: "khonsari" },
  ];

  const positives = [
    "You were on time.",
    "You were decisive and took initiative with planning the date (even though we ended up going with the place I picked, nice try).",
    "You came across as confident and masculine.",
    "You were kind to the staff and tipped well.",
    "You made me laugh.",
  ];

  const negatives = [
    "You drove recklessly and were speeding.",
    "You didn’t bring flowers.",
    "You got too touchy and intimate for a first date.",
    "You bruised me.",
    "You came across as very cocky.",
    "Your Instagram following list is massive — it looks like everyone except my grandma is on there.",
    "You acted so bossy and appeared to believe you were in charge. This was adorable, but incorrect.",
  ];

  const disagreementResponses = [
    "Disagreement logged. It will be ignored respectfully.",
    "Your objection has been archived in the void.",
    "Thank you for your feedback. We will not be using it.",
    "A committee has reviewed your concern and laughed.",
    "Error: disagreement functionality is currently unavailable.",
    "Appeal rejected by unanimous vote (1-0).",
    "Your confidence is inspiring. The findings remain unchanged.",
  ];

  const getRandomDisagreementMessage = (current = "") => {
    let message = current;
    while (
      disagreementResponses.length > 1 &&
      message === current
    ) {
      message =
        disagreementResponses[
          Math.floor(Math.random() * disagreementResponses.length)
        ];
    }
    return message;
  };

  const availability: Record<string, string[]> = {
    "2026-06-27": ["6:00 PM", "7:30 PM", "9:00 PM"],
    "2026-07-03": ["8:10 PM", "9:30 PM"],
    "2026-07-04": ["6:00 PM", "7:30 PM"],
  };
  const availableDates = Object.keys(availability);

  const isDateAvailable = (date: Date) => {
    const key = date.toISOString().split("T")[0];
    return availableDates.includes(key);
  };

  const allPossibleSlots = [
    "6:00 PM",
    "9:00 PM",
    "12:00 AM",
  ];

  const [messageIndex, setMessageIndex] = useState(0);
  const selectedKey = selectedDate
    ? selectedDate.toISOString().split("T")[0]
    : "";

  const times = availability[selectedKey] || [];

  const [responses, setResponses] = useState<Record<string, string>>({});

  const checkEligibility = () => {
    if (!firstName.trim() || !lastName.trim()) {
      setError("You have to enter both first name and last name.");
      return;
    }

    const valid = allowedNames.some(
      (p) =>
        p.first === firstName.trim().toLowerCase() &&
        p.last === lastName.trim().toLowerCase()
    );

    if (!valid) {
      setError("Invalid user doesn't exist.");
      return;
    }

    setError("");
    setStep(2);
  };

  return (
    <main className="min-h-screen bg-pink-50 flex items-center justify-center p-6">
      <div className="bg-white dark:bg-gray-900 shadow-xl rounded-3xl p-8 w-full max-w-2xl">
        {/* STEP 1 */}
        {step === 1 && (
          <>
            <h1 className="text-3xl font-bold mb-3 text-gray-900 dark:text-gray-100">
              Round 2 Eligibility Check 💌
            </h1>
            <p className="mb-6 text-gray-600 dark:text-gray-300">
              Enter your name to see if you qualify for Round 2.
            </p>
            <input
              className="w-full border p-3 rounded-xl mb-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              className="w-full border p-3 rounded-xl mb-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <button
              className="bg-pink-500 text-white px-6 py-3 rounded-xl hover:bg-pink-600"
              onClick={checkEligibility}
            >
              Check Eligibility
            </button>
            {error && <p className="text-red-500 mt-4">{error}</p>}
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">Congratulations 🎉</h1>
            <p className="mb-3 text-lg text-gray-700 dark:text-gray-300">
              Congratulations. Our first date has been officially reviewed.
            </p>
            <p className="mb-6 text-gray-600 dark:text-gray-400">Please review the findings below.</p>
            <button
              className="bg-pink-500 text-white px-6 py-3 rounded-xl hover:bg-pink-600"
              onClick={() => setStep(3)}
            >
              View Findings
            </button>
          </>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <>
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Positives 📈</h2>
            <div className="space-y-3">
              {positives.map((item) => (
                <div key={item} className="border rounded-xl p-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                  {item}
                </div>
              ))}
            </div>
            <button
              className="mt-6 bg-pink-500 text-white px-6 py-3 rounded-xl hover:bg-pink-600"
              onClick={() => setStep(4)}
            >
              Continue
            </button>
          </>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <>
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Areas for Review ⚠️</h2>
            <p className="mb-6 text-gray-600 dark:text-gray-300">
              Please indicate whether you agree with the findings below.
            </p>
            {negatives.map((item) => (
              <div key={item} className="border rounded-xl p-4 mb-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                <p className="mb-3">{item}</p>
                <div className="flex flex-col gap-2">
                  {/* BUTTON ROW */}
                  <div className="flex gap-6 items-center">
                    <label
                      className={`transition-all duration-300 ${
                        disagreedItem === item ? "scale-125 font-bold text-green-600" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name={item}
                        checked={responses[item] === "agree"}
                        onChange={() => {
                          setResponses((prev) => ({ ...prev, [item]: "agree" }));
                          setDisagreedItem("");
                          setDisagreeMessages((prev) => ({
                            ...prev,
                            [item]: "",
                          }));
                          setNegativeError("");
                        }}
                      />
                      <span className="ml-2">Agree</span>
                    </label>

                    <label>
                      <input
                        type="radio"
                        name={item}
                        onChange={() => {
                          const randomMessage = disagreementResponses[messageIndex];

                          setMessageIndex(
                            (prev) => (prev + 1) % disagreementResponses.length
                          );

                          setDisagreeMessages((prev) => ({
                            ...prev,
                            [item]: randomMessage,
                          }));

                          setDisagreedItem(item);
                          setResponses((prev) => ({ ...prev, [item]: "agree" }));

                          setTimeout(() => {
                            setDisagreeMessages((prev) => ({
                              ...prev,
                              [item]: "",
                            }));
                          }, 2500);
                        }}
                      />
                      <span className="ml-2">Disagree</span>
                    </label>
                  </div>

                  {/* MESSAGE UNDER BUTTONS */}
                  {disagreeMessages[item] && (
                    <p className="text-sm text-gray-500 italic">{disagreeMessages[item]}</p>
                  )}
                </div>
              </div>
            ))}
            {negativeError && (
              <p className="text-red-500 mb-4 font-semibold">{negativeError}</p>
            )}
            <textarea
              className="w-full border rounded-xl p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              rows={4}
              placeholder="You may explain yourself here..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              className="mt-6 bg-pink-500 text-white px-6 py-3 rounded-xl hover:bg-pink-600"
              onClick={() => {
                const allAgreed = negatives.every(
                  (item) => responses[item] === "agree"
                );
                if (!allAgreed) {
                  setNegativeError("You must agree to all findings before proceeding.");
                  return;
                }
                setStep(5);
              }}
            >
              Continue
            </button>
          </>
        )}

        {step === 5 && (
          <>
            <div className="grid md:grid-cols-2 gap-6 items-start w-full">
              {/* LEFT: Calendar */}
              <div className="min-w-0">
                <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
                  Select a Date
                </h3>

                <div className="bg-white dark:bg-gray-800 border rounded-2xl p-3 shadow-sm w-full overflow-hidden">
                  <Calendar
  mode="single"
  selected={selectedDate}
  onSelect={setSelectedDate}
  disabled={(date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const d = new Date(date);
    d.setHours(0, 0, 0, 0);

    const key = date.toISOString().split("T")[0];

    if (
      key === "2026-06-19" ||
      key === "2026-06-20" ||
      key === "2026-06-26"
    ) {
      return false;
    }

    return d < today || !Object.keys(availability).includes(key);
  }}
  className="rounded-md w-full"
  classNames={{
    day: "h-9 w-9 p-0 font-normal flex items-center justify-center",

    // 👇 ADD THIS
selected:
      "bg-pink-500 text-white rounded-md hover:bg-pink-600",

    day_button: "h-9 w-9 flex items-center justify-center",
  }}
/>
                </div>
              </div>

              {/* RIGHT: Times */}
              <div className="min-w-0">
                {selectedDate ? (
                  <>
                    <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
                      Time Slots
                    </h3>
                    {/* Generate 3-hour slots from 6:00 PM to 11:00 PM */}
                    {(() => {
                      const allSlots = [];
                      const startHour = 18; // 6 PM
                      const endHour = 23; // 11 PM
                      for (let hour = startHour; hour <= endHour; hour++) {
                        const displayHour = hour > 12 ? hour - 12 : hour;
                        const ampm = hour >= 12 ? "PM" : "AM";
                        allSlots.push(`${displayHour}:00 ${ampm}`);
                      }

                      const dateKey = selectedKey;

                      // Determine if date is fully unavailable
                      const fullyUnavailableDates = ["2026-06-19", "2026-06-20", "2026-06-26"];

                      const isDateUnavailable = fullyUnavailableDates.includes(dateKey);

                      // Get the actual available times for the date
                      const availableTimes = availability[dateKey] || [];

                      return (
                        <div className="grid grid-cols-2 gap-2">
                          {allSlots.map((slot) => {
                            // Check if slot is available
                            const isSlotAvailable =
                              isDateUnavailable
                                ? false
                                : availableTimes.some((t) => t.startsWith(slot));
                            const isSelected = selectedSlot === slot;
                            const isUnavailable = !isSlotAvailable;

                            return (
                              <button
                                key={slot}
                                onClick={() => isSlotAvailable && setSelectedSlot(slot)}
                                disabled={isUnavailable}
                                className={`rounded-lg border p-2 text-sm transition ${
                                  isSelected
                                    ? "bg-pink-500 text-white border-pink-500"
                                    : "hover:bg-pink-50"
                                } ${
                                  isUnavailable
                                    ? "bg-gray-200 text-gray-400 cursor-not-allowed opacity-50"
                                    : ""
                                }`}
                              >
                                {slot}
                              </button>
                            );
                          })}
                        </div>
                      );
                    })()}
                  </>
                ) : (
                  <p className="text-gray-600 text-sm dark:text-gray-400">
                    Please select a date to see available times.
                  </p>
                )}
              </div>
            </div>
          
    {/* SUBMIT BUTTON */}
<button
  disabled={!selectedDate || !selectedSlot}
  onClick={async () => {
    if (!selectedDate || !selectedSlot) return;

    const { data, error } = await supabase
      .from("application")
      .insert({
       first_name: firstName,
      last_name: lastName,
      selected_slot: selectedSlot,
      responses: responses,
      comment: comment,
      })
      .select();

    if (error) {
      console.error("Supabase error:", error);
      alert(error.message);
      return;
    }

    console.log("Saved row:", data);
    setStep(6);
  }}
  className={`mt-8 w-full py-3 rounded-xl font-medium transition ${
    selectedDate && selectedSlot
      ? "bg-pink-500 text-white hover:bg-pink-600"
      : "bg-gray-200 text-gray-400 cursor-not-allowed"
  }`}
>
  Submit Application 💖
</button>
  </>
)}
        {/* STEP 6 */}
        {step === 6 && (
          <>
            <h1 className="text-4xl font-bold mb-4">Submission Complete 💖</h1>
            <p className="text-lg">Your application has been successfully submitted.</p>
            <p className="mt-4 text-gray-600">
              Thank you for participating in the evaluation process.
              The committee (me) will review your responses.
            </p>
          </>
        )}
      </div>
    </main>
  );
}
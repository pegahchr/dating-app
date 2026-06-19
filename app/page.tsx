"use client";

import { useState } from "react";

export default function Home() {
  const [selectedSlot, setSelectedSlot] = useState("");
  const [step, setStep] = useState(1);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [comment, setComment] = useState("");
  const [booking, setBooking] = useState("");

  const [error, setError] = useState("");
  const [negativeError, setNegativeError] = useState("");

  const allowedNames = [
    { first: "sam", last: "mortazavi" },
    { first: "amin", last: "khonsari" },
  ];

  const positives = [
    "You were on time.",
    "You were decisive and took initiative with planning the date (even though we ended up going with the place I suggested).",
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
  ];

  const availableSlots = [
  {
    date: "Saturday, June 27",
    times: ["6:00 PM", "7:30 PM", "9:00 PM"],
  },
  {
    date: "Friday, July 3",
    times: ["8:10 PM", "9:30 PM"],
  },
  {
    date: "Saturday, July 4",
    times: ["6:00 PM", "7:30 PM"],
  },
  {
    date: "Friday, July 10",
    times: ["8:10 PM", "9:30 PM"],
  },
];
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

  const handleNegativeChange = (item: string, value: string) => {
    if (value === "disagree") {
      setNegativeError("You have to agree. Disagreeing is not allowed.");
      return;
    }

    setNegativeError("");

    setResponses((prev) => ({
      ...prev,
      [item]: value,
    }));
  };

  const canProceedFromNegatives = () => {
    return negatives.every((n) => responses[n] === "agree");
  };

  return (
    <main className="min-h-screen bg-pink-50 flex items-center justify-center p-6">
      <div className="bg-white shadow-xl rounded-3xl p-8 w-full max-w-2xl">

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <h1 className="text-3xl font-bold mb-3">
              Round 2 Eligibility Check 💌
            </h1>

            <p className="mb-6 text-gray-600">
              Enter your name to see if you qualify for Round 2.
            </p>

            <input
              className="w-full border p-3 rounded-xl mb-4"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />

            <input
              className="w-full border p-3 rounded-xl mb-6"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />

            <button
              className="bg-pink-500 text-white px-6 py-3 rounded-xl"
              onClick={checkEligibility}
            >
              Check Eligibility
            </button>

            {error && (
              <p className="text-red-500 mt-4">{error}</p>
            )}
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <h1 className="text-4xl font-bold mb-4">
              Congratulations 🎉
            </h1>

            <p className="mb-3 text-lg">
              Congratulations. Our first date has been officially reviewed.
            </p>

            <p className="mb-6 text-gray-600">
              Please review the findings below.
            </p>

            <button
              className="bg-pink-500 text-white px-6 py-3 rounded-xl"
              onClick={() => setStep(3)}
            >
              View Findings
            </button>
          </>
        )}

        {/* STEP 3 - POSITIVES */}
        {step === 3 && (
          <>
            <h2 className="text-2xl font-bold mb-6">
              Positives 📈
            </h2>

            <div className="space-y-3">
              {positives.map((item) => (
                <div key={item} className="border rounded-xl p-4">
                  {item}
                </div>
              ))}
            </div>

            <button
              className="mt-6 bg-pink-500 text-white px-6 py-3 rounded-xl"
              onClick={() => setStep(4)}
            >
              Continue
            </button>
          </>
        )}
{/* STEP 4 - NEGATIVES (STRICT AGREEMENT) */}
{step === 4 && (
  <>
    <h2 className="text-2xl font-bold mb-6">
      Areas for Review ⚠️
    </h2>

    <p className="mb-6 text-gray-600">
      Please indicate whether you agree with the findings below.
    </p>

    {negatives.map((item) => (
      <div key={item} className="border rounded-xl p-4 mb-4">
        <p className="mb-3">{item}</p>

        <div className="flex gap-6">
          <label>
            <input
              type="radio"
              name={item}
              checked={responses[item] === "agree"}
              onChange={() => {
                setResponses((prev) => ({
                  ...prev,
                  [item]: "agree",
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
                setNegativeError(
                  "You have to agree. If you disagree, please explain yourself in the comment section below."
                );

                setResponses((prev) => ({
                  ...prev,
                  [item]: "agree",
                }));
              }}
            />
            <span className="ml-2">Disagree</span>
          </label>
        </div>
      </div>
    ))}

    {negativeError && (
      <p className="text-red-500 mb-4">
        {negativeError}
      </p>
    )}

    <textarea
      className="w-full border rounded-xl p-3"
      rows={4}
      placeholder="You may explain yourself here..."
      value={comment}
      onChange={(e) => setComment(e.target.value)}
    />

    <button
      className="mt-6 bg-pink-500 text-white px-6 py-3 rounded-xl"
      onClick={() => {
        const allAgreed = negatives.every(
          (item) => responses[item] === "agree"
        );

        if (!allAgreed) {
          setNegativeError(
            "You must agree to all findings before proceeding."
          );
          return;
        }

        setStep(5);
      }}
    >
      Continue
    </button>
  </>
)}
{/* STEP 5 - BOOKING */}
{step === 5 && (
  <>
    <h2 className="text-2xl font-bold mb-4">
      Round 2 Invitation 📅
    </h2>

    <p className="mb-6 text-gray-600">
      Pick a time that works for you.
    </p>

    <div className="space-y-3 mb-6">

      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
        ❌ Friday, June 19 — No availability left
      </div>

      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
        ❌ Saturday, June 20 — No availability left
      </div>

      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
        ❌ Friday, June 26 — No availability left
      </div>

      {availableSlots.map((day) => (
        <div
          key={day.date}
          className="border rounded-xl p-4"
        >
          <h3 className="font-semibold mb-3">
            {day.date}
          </h3>

          <div className="flex flex-wrap gap-2">
            {day.times.map((time) => {
              const slot = `${day.date} - ${time}`;

              return (
                <button
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  className={`px-4 py-2 rounded-lg border transition ${
                    selectedSlot === slot
                      ? "bg-pink-500 text-white border-pink-500"
                      : "bg-white hover:bg-pink-50"
                  }`}
                >
                  {time}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>

    <button
      disabled={!selectedSlot}
      className={`px-6 py-3 rounded-xl text-white ${
        selectedSlot
          ? "bg-green-500"
          : "bg-gray-400 cursor-not-allowed"
      }`}
      onClick={() => setStep(6)}
    >
      Confirm Booking
    </button>
  </>
)}
        {/* STEP 6 */}
        {step === 6 && (
          <>
            <h1 className="text-4xl font-bold mb-4">
              Submission Complete 💖
            </h1>

            <p className="text-lg">
              Your application has been successfully submitted.
            </p>

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
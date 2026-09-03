"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Loader2,
  ShieldCheck,
  Ticket,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";

import {
  createPaymentOrder,
  getTicket,
  verifyPayment,
  type ApiTicket,
  type ApiPaymentVerification,
} from "@/lib/api";

type PaymentStatus =
  | "pending"
  | "processing"
  | "success"
  | "failed";

type RazorpaySuccessResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpaySuccessResponse) => void;
  modal?: {
    ondismiss?: () => void;
  };
  theme?: {
    color?: string;
  };
};

type RazorpayInstance = {
  open: () => void;
  on: (
    event: string,
    callback: (response: unknown) => void,
  ) => void;
};

type RazorpayConstructor = new (
  options: RazorpayOptions,
) => RazorpayInstance;

declare global {
  interface Window {
    Razorpay: RazorpayConstructor;
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }

    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const existingScript = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]',
    );

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(true));
      existingScript.addEventListener("error", () => resolve(false));
      return;
    }

    const script = document.createElement("script");

    script.src =
      "https://checkout.razorpay.com/v1/checkout.js";

    script.async = true;

    script.onload = () => resolve(true);

    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
}

export default function PaymentPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const eventId = Array.isArray(params.eventId)
    ? params.eventId[0]
    : params.eventId;

  const ticketId = searchParams.get("ticketId");

  const [ticket, setTicket] = useState<ApiTicket | null>(null);

  const [payment, setPayment] =
    useState<ApiPaymentVerification | null>(null);

  const [status, setStatus] =
    useState<PaymentStatus>("pending");

  const [error, setError] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTicketData() {
      if (!ticketId) {
        setError("No ticket ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const ticketData = await getTicket(
          parseInt(ticketId, 10),
        );

        setTicket(ticketData);

        if (ticketData.status === "paid") {
          setStatus("success");
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load ticket",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchTicketData();
  }, [ticketId]);

  const handleProcessPayment = async () => {
    if (!ticketId) {
      setError("No ticket ID provided");
      return;
    }

    if (!ticket) {
      setError("Ticket information is not available");
      return;
    }

    setStatus("processing");
    setError(null);

    try {
      // --------------------------------------------------------
      // 1. Load Razorpay Checkout
      // --------------------------------------------------------

      const razorpayLoaded = await loadRazorpayScript();

      if (!razorpayLoaded) {
        throw new Error(
          "Unable to load Razorpay Checkout. Please check your internet connection.",
        );
      }

      // --------------------------------------------------------
      // 2. Create Razorpay order on the backend
      // --------------------------------------------------------

      const order = await createPaymentOrder(
        parseInt(ticketId, 10),
      );

      // --------------------------------------------------------
      // 3. Configure Razorpay Checkout
      // --------------------------------------------------------

      const options: RazorpayOptions = {
        key: order.razorpay_key_id,

        amount: Math.round(
          Number(order.amount) * 100,
        ),

        currency: order.currency,

        name: "Evently",

        description: `Ticket #${ticket.id}`,

        order_id: order.razorpay_order_id,

        handler: async (
          response: RazorpaySuccessResponse,
        ) => {
          try {
            setStatus("processing");
            setError(null);

            // --------------------------------------------------
            // 4. Verify payment on backend
            // --------------------------------------------------

            const verifiedPayment =
              await verifyPayment({
                ticket_id: parseInt(ticketId, 10),
                razorpay_order_id:
                  response.razorpay_order_id,
                razorpay_payment_id:
                  response.razorpay_payment_id,
                razorpay_signature:
                  response.razorpay_signature,
              });

            // --------------------------------------------------
            // 5. Payment successfully verified
            // --------------------------------------------------

            setPayment(verifiedPayment);

            setTicket((previousTicket) =>
              previousTicket
                ? {
                    ...previousTicket,
                    status: "paid",
                  }
                : previousTicket,
            );

            setStatus("success");
          } catch (err) {
            setError(
              err instanceof Error
                ? err.message
                : "Payment verification failed",
            );

            setStatus("failed");
          }
        },

        modal: {
          ondismiss: () => {
            setStatus("pending");
            setError(null);
          },
        },

        theme: {
          color: "#7c3aed",
        },
      };

      // --------------------------------------------------------
      // 6. Open Razorpay Checkout
      // --------------------------------------------------------

      const razorpay = new window.Razorpay(options);

      razorpay.on(
        "payment.failed",
        (response: unknown) => {
          const failedResponse =
            response as {
              error?: {
                description?: string;
              };
            };

          setError(
            failedResponse?.error?.description ||
              "Payment failed",
          );

          setStatus("failed");
        },
      );

      razorpay.open();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to start payment",
      );

      setStatus("failed");
    }
  };

  // ------------------------------------------------------------
  // Loading
  // ------------------------------------------------------------

  if (loading) {
    return (
      <main className="campus-background min-h-screen overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-violet-400" />
          </div>
        </div>
      </main>
    );
  }

  // ------------------------------------------------------------
  // Error while loading ticket
  // ------------------------------------------------------------

  if (error && !ticket) {
    return (
      <main className="campus-background min-h-screen overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <XCircle className="mx-auto h-12 w-12 text-red-400" />

          <h3 className="mt-4 text-lg font-medium">
            Payment Error
          </h3>

          <p className="mt-2 text-white/40">
            {error}
          </p>

          <Link
            href="/events"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
          >
            Back to events
            <ArrowLeft size={16} />
          </Link>
        </div>
      </main>
    );
  }

  if (!ticket) {
    return null;
  }

  return (
    <main className="campus-background min-h-screen overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-md">

          {/* Back link */}
          <Link
            href={`/events/${eventId}`}
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-white/60 hover:text-white"
          >
            <ArrowLeft size={16} />
            Back to event
          </Link>

          {/* ================================================== */}
          {/* PENDING */}
          {/* ================================================== */}

          {status === "pending" && (
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="rounded-2xl border border-white/10 bg-[#0c101a]/50 p-8 text-center"
            >
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-violet-500/20">
                <CreditCard className="h-8 w-8 text-violet-400" />
              </div>

              <h2 className="text-2xl font-bold">
                Complete Payment
              </h2>

              <p className="mt-2 text-white/50">
                Secure checkout for your ticket
              </p>

              {/* Ticket information */}
              <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.02] p-4 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-white/50">
                    Ticket
                  </span>

                  <span className="font-medium">
                    #{ticket.id}
                  </span>
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <span className="text-white/50">
                    Amount
                  </span>

                  <span className="text-xl font-bold">
                    ₹{ticket.total_amount}
                  </span>
                </div>
              </div>

              {/* Pay button */}
              <button
                onClick={handleProcessPayment}
                className="mt-8 w-full rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
              >
                Pay ₹{ticket.total_amount}
              </button>

              <p className="mt-4 flex items-center justify-center gap-2 text-sm text-white/50">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                Secure payment processing
              </p>
            </motion.div>
          )}

          {/* ================================================== */}
          {/* PROCESSING */}
          {/* ================================================== */}

          {status === "processing" && (
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="rounded-2xl border border-white/10 bg-[#0c101a]/50 p-8 text-center"
            >
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-violet-500/20">
                <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
              </div>

              <h2 className="text-2xl font-bold">
                Processing Payment
              </h2>

              <p className="mt-2 text-white/50">
                Please wait while we process your payment...
              </p>
            </motion.div>
          )}

          {/* ================================================== */}
          {/* SUCCESS */}
          {/* ================================================== */}

          {status === "success" && (
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.9,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-8 text-center"
            >
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20">
                <CheckCircle2 className="h-8 w-8 text-emerald-400" />
              </div>

              <h2 className="text-2xl font-bold text-emerald-300">
                Payment Successful!
              </h2>

              <p className="mt-2 text-white/50">
                Your ticket has been confirmed
              </p>

              {/* Payment details */}
              {payment && (
                <div className="mt-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-left">

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-emerald-500">
                      Transaction ID
                    </span>

                    <span className="break-all text-right font-mono text-sm">
                      {payment.transaction_id ||
                        payment.razorpay_payment_id ||
                        "N/A"}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-emerald-500">
                      Amount Paid
                    </span>

                    <span className="font-bold">
                      ₹{payment.amount}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-emerald-500">
                      Status
                    </span>

                    <span className="font-medium capitalize">
                      {payment.status}
                    </span>
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="mt-6 flex gap-3">
                <Link
                  href="/tickets"
                  className="flex-1 rounded-xl bg-white px-6 py-3 text-center text-sm font-semibold text-black transition hover:bg-white/90"
                >
                  <span className="inline-flex items-center justify-center gap-2">
                    View My Tickets
                    <Ticket className="h-4 w-4" />
                  </span>
                </Link>

                <Link
                  href="/events"
                  className="flex-1 rounded-xl border border-white/10 bg-white/[0.02] px-6 py-3 text-center text-sm font-semibold text-white/60 transition hover:border-white/20 hover:bg-white/[0.04] hover:text-white"
                >
                  Browse Events
                </Link>
              </div>
            </motion.div>
          )}

          {/* ================================================== */}
          {/* FAILED */}
          {/* ================================================== */}

          {status === "failed" && (
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="rounded-2xl border border-red-500/30 bg-red-500/10 p-8 text-center"
            >
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20">
                <XCircle className="h-8 w-8 text-red-400" />
              </div>

              <h2 className="text-2xl font-bold text-red-300">
                Payment Failed
              </h2>

              <p className="mt-2 text-white/50">
                {error ||
                  "An error occurred during payment processing"}
              </p>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => {
                    setError(null);
                    setStatus("pending");
                  }}
                  className="flex-1 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
                >
                  Try Again
                </button>

                <Link
                  href="/events"
                  className="flex-1 rounded-xl border border-white/10 bg-white/[0.02] px-6 py-3 text-center text-sm font-semibold text-white/60 transition hover:border-white/20 hover:bg-white/[0.04] hover:text-white"
                >
                  Back to Events
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </main>
  );
}
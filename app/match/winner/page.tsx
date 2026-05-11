"use client";

import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { useRouter } from "next/navigation";
import { TrophyIcon } from "@/components/Icons";
import { motion } from "framer-motion";

export default function MatchWinnerPage() {
  const router = useRouter();
  const [searchParams, setSearchParams] = useState<URLSearchParams>(
    new URLSearchParams(),
  );

  useEffect(() => {
    setSearchParams(new URLSearchParams(window.location.search));
  }, []);

  const winnerName = searchParams.get("winner") || "Kunal Verma";
  const finalScore = searchParams.get("score") || "15-08";

  return (
    <Layout title="Live Match" showBack showBottomNav={false}>
      <div className="relative min-h-screen">
        <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-md" />

        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center px-6 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 180, damping: 12 }}
            className="mb-4 text-[#F7B31B]"
          >
            <TrophyIcon size={52} />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm font-semibold text-white/80"
          >
            Winner
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-2 text-2xl font-bold text-white"
          >
            {winnerName}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-2 text-sm text-white/80"
          >
            Final Score: {finalScore}
          </motion.p>
        </div>

        <motion.div
          initial={{ y: 60 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.4 }}
          className="fixed inset-x-0 bottom-0 z-50 bg-transparent px-6 pb-6 pt-4"
        >
          <button
            type="button"
            onClick={() => router.replace("/user/home")}
            className="w-full rounded-2xl bg-primary py-4 text-base font-semibold text-white shadow-lg active:scale-[0.98] transition"
          >
            Confirm Results
          </button>
        </motion.div>

        </div>
    </Layout>
  );
}

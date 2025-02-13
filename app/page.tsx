"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    const playAudio = () => {
      if (audioRef.current) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            console.log("Autoplay blocked, waiting for user interaction.");
          });
        }
      }
    };

    playAudio();
    document.addEventListener("click", playAudio, { once: true });

    return () => {
      document.removeEventListener("click", playAudio);
    };
  }, []);
  useGSAP(
    () => {
      const tl = gsap.timeline({ repeat: -1 });
      tl.to(".glow", {
        filter: "drop-shadow(0 0 10px #f39c12) ",
        duration: 1.7,
      });
      tl.to(".glow", {
        filter: "drop-shadow(0 0 0px #f39c12) drop-shadow(0 0 0px #f39c12)",
        duration: 1.7,
      });
    },
    { dependencies: [], revertOnUpdate: false }
  );
  return (
    <div className="relative font-darumadrop w-full h-screen bg-[#33302B]">
      <audio ref={audioRef} src="/samidare.mp3" loop />

      <div className="w-full absolute  top-0 left-0 h-screen  opacity-15">
        <video
          muted
          autoPlay
          loop
          disablePictureInPicture
          controlsList="nodownload nofullscreen noplaybackrate"
          src="/kk.mp4"
          className="w-full relative z-10 h-full object-cover"
        />
      </div>
      <div className="text-[10vw] font-bold text-center text-white">
        NARUTO Chatbot
      </div>
      <div className="text-md gap-5 uppercase font-semibold text-center text-white flex justify-center items-center flex-col absolute bottom-10 left-0 right-0">
        <a href="/chat" target="_blank">
          <button className="glow uppercase font-darumadrop text-3xl font-bold">
            try now
          </button>
        </a>
        try chatting with your favourite naruto character
      </div>
    </div>
  );
}

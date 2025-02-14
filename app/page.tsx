"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    setLoading(false);
  }, []);
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
        filter: "drop-shadow(0 0 10px #d40000) drop-shadow(0 0 40px #d40000)",
        duration: 1.7,
      });
      tl.to(".glow", {
        filter: "drop-shadow(0 0 0px #d40000) drop-shadow(0 0 0px #d40000)",
        duration: 1.7,
      });
    },
    { dependencies: [], revertOnUpdate: false }
  );
  useGSAP(
    () => {
      const tl = gsap.timeline();
      tl.to("#eye", {
        duration: 1,
        delay: 0.3,
        rotate: 720,
        scale: 10,

        onComplete: () => {
          gsap.set("#par", { display: "none" });
        },
      });
    },
    { dependencies: [] }
  );

  return (
    <>
      {loading && (
        <>
          <div className="w-full  top-0 h-screen bg-black">loading</div>
        </>
      )}
      <div className="relative font-darumadrop w-full h-screen bg-[#33302B]">
        <div
          id="par"
          className="h-screen w-full bg-black flex justify-center absolute z-30 top-0 items-center overflow-hidden"
        >
          <div id="eye" className="w-32 h-32 relative">
            <Image
              src="/sharingan.jpg"
              fill
              alt="eye"
              priority
              className="w-full absolute top-0 z-10 h-full object-cover"
            />
          </div>
        </div>

        <audio ref={audioRef} src="/samidare.mp3" loop />

        <div className="w-full absolute  top-0 left-0 h-screen  opacity-45">
          <video
            muted
            autoPlay
            loop
            playsInline
            controlsList="nodownload nofullscreen noplaybackrate"
            src="/madara.mp4"
            className="w-full absolute top-0 z-10 h-full object-cover"
          />
        </div>
        <div className="text-[10vw] font-bold text-center text-white drop-shadow-[0_0_10px_#000000]">
          NARUTO Chatbot
        </div>
        <div className="text-md gap-5 uppercase font-semibold text-center text-white flex justify-center items-center flex-col absolute bottom-10 left-0 right-0 drop-shadow-[0_0_10px_#000000]">
          <a href="/chat" target="_blank">
            <button className="glow uppercase font-darumadrop text-3xl font-bold">
              try now
            </button>
          </a>
          try chatting with your favourite naruto character
        </div>
      </div>
    </>
  );
}

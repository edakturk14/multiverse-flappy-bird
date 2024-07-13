import React from "react";
import { HeartIcon } from "@heroicons/react/24/outline";

/**
 * Site footer
 */
export const Footer = () => {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-white py-5 px-1 shadow-lg z-50">
      <div className="w-full">
        <ul className="menu menu-horizontal w-full">
          <div className="flex justify-center items-center gap-2 text-sm w-full">
            <div className="text-center">
              <a
                href="https://github.com/edakturk14/multiverse-flappy-bird"
                target="_blank"
                rel="noreferrer"
                className="link"
              >
                Fork me
              </a>
            </div>
            <span>·</span>
            <div className="flex justify-center items-center gap-2">
              <p className="m-0 text-center">
                Built with <HeartIcon className="inline-block h-4 w-4" /> at
              </p>
              <a
                className="flex justify-center items-center gap-1"
                href="https://ethglobal.com/events/brussels"
                target="_blank"
                rel="noreferrer"
              >
                <span className="link">ETHGlobal Brussels</span>
              </a>
            </div>
          </div>
        </ul>
      </div>
    </div>
  );
};

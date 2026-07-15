"use client";

const ExploreBtn = () => {
  return (
    <button
      type="button"
      id="explore-btn"
      className="mt-7 mx-auto border border-gray-500 bg-gray-600/30 text-white rounded-full px-10 py-2 cursor-pointer hover:bg-gray-500/50 transition-colors"
      onClick={() => console.log("hi")}
    >
      <a href="#events">Explore Events</a>
    </button>
  );
};

export default ExploreBtn;

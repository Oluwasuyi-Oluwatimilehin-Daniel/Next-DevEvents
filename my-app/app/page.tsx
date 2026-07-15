import ExploreBtn from "@/components/ExploreBtn";

const page = () => {
  return (
    <section className="flex flex-col px-4 py-12">
      <h1 className="text-center text-4xl font-medium">
        {" "}
        The Hub for Every Dev <br />{" "}
        <span className="text-shadow-zinc-500/15">Event You Can't Miss</span>
      </h1>
      <p className="text-center mt-1">
        Hackatons, Meetups, and Conferences, All In One Place
      </p>

      <ExploreBtn />
    </section>
  );
};

export default page;

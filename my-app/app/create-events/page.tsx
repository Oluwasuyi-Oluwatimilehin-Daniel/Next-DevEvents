const page = () => {
  return <form action="/create-events" className="">
    <input type="text" placeholder="Event Name" />
    <input type="date" placeholder="Event Date" />
    <button type="submit">Create Event</button>
  </form>;
};

export default page;

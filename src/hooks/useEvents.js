import { useState, useEffect } from 'react';
import matter from 'gray-matter';

const useEvents = () => {
  const [events, setEvents] = useState({ upcoming: [], past: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = () => {
      try {
        const modules = import.meta.glob('../content/events/*.md', { query: '?raw', eager: true, import: 'default' });
        const allEvents = Object.values(modules).map((fileContent) => {
          const { data } = matter(fileContent);
          return data;
        });

        const currentDate = new Date();

        const upcomingEvents = allEvents
          .filter(event => new Date(event.eventDate) >= currentDate)
          .sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));

        const pastEvents = allEvents
          .filter(event => new Date(event.eventDate) < currentDate)
          .sort((a, b) => new Date(b.eventDate) - new Date(a.eventDate));

        setEvents({ upcoming: upcomingEvents, past: pastEvents });
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to load events from local files.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return { events, loading, error };
};

export default useEvents;

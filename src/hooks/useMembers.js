import { useState, useEffect } from 'react';
import matter from 'gray-matter';

const useMembers = () => {
  const [members, setMembers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMembers = () => {
      try {
        const modules = import.meta.glob('../content/members/*.md', { query: '?raw', eager: true, import: 'default' });
        const allMembers = Object.values(modules).map((fileContent) => {
          const { data } = matter(fileContent);
          return data;
        });

        const categorizedMembers = categorizeMembers(allMembers);
        const facultyMembers = allMembers.filter(m => m.position === 'Faculty');

        setMembers({
          ...categorizedMembers,
          faculty: facultyMembers
        });

      } catch (err) {
        console.error("Error fetching members:", err);
        setError("Failed to load members from local files.");
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const categorizeMembers = (members) => {
    const categorized = {
      obsTeam: [],
      cseTeam: [],
      contentTeam: [],
      graphicsTeam: [],
      logisticsTeam: [],
      rasTeam: [],
      socialmediaTeam: [],
      technicalTeam: [],
      eeeTeam: [],
      wieTeam: [],
    };

    members.forEach(member => {
      if (member.position === 'OBs') {
        categorized.obsTeam.push(member);
      } else if (member.position !== 'Faculty') {
        const teamName = member.team.toLowerCase().replace(/ /g, '');
        const teamKey = `${teamName}Team`;
        if (categorized[teamKey]) {
          categorized[teamKey].push(member);
        } else if (teamName === 'logisticandtechnical') {
            categorized.logisticsTeam.push(member);
            categorized.technicalTeam.push(member);
        } else if (teamName === 'socialmediaandcontent') {
            categorized.socialmediaTeam.push(member);
            categorized.contentTeam.push(member);
        }
      }
    });

    // Sort teams to place "Head" before "Member"
    Object.keys(categorized).forEach(key => {
      if (key.endsWith('Team')) {
        categorized[key].sort((a, b) => {
          if (a.position === "Department Head") return -1;
          if (b.position === "Department Head") return 1;
          return 0;
        });
      }
    });

    return categorized;
  };

  return { members, loading, error };
};

export default useMembers;

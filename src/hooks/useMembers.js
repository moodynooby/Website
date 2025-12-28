import { useState, useEffect } from 'react';
import matter from 'gray-matter';

const useMembers = () => {
  const [members, setMembers] = useState({});
  const [loading, setLoading]_useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMembers = () => {
      try {
        const modules = import.meta.glob('/src/content/members/*.md', { query: '?raw', eager: true, import: 'default' });
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
      obsChairperson: [],
      obsCoChairperson: [],
      obsSecretary: [],
      obsJointSecretary: [],
      obsTreasurer: [],
      cseTeam: [],
      contentTeam: [],
      graphicsTeam: [],
      logisticsTeam: [],
      rasTeam: [],
      socialmediaTeam: [],
      technicalTeam: []
    };

    members.forEach(member => {
      if (member.department === 'OBs') {
        if (member.position === 'Chairperson') categorized.obsChairperson.push(member);
        else if (member.position === 'Co - Chairperson') categorized.obsCoChairperson.push(member);
        else if (member.position === 'Secretary') categorized.obsSecretary.push(member);
        else if (member.position === 'Joint - Secretary') categorized.obsJointSecretary.push(member);
        else if (member.position === 'Treasurer') categorized.obsTreasurer.push(member);
      } else if (member.position !== 'Faculty') {
        const teamKey = `${member.department.toLowerCase()}Team`;
        if (categorized[teamKey]) {
          categorized[teamKey].push(member);
        }
      }
    });

    // Sort teams to place "Head" before "Member"
    Object.keys(categorized).forEach(key => {
      if (key.endsWith('Team')) {
        categorized[key].sort((a, b) => {
          if (a.position === "Head") return -1;
          if (b.position === "Head") return 1;
          return 0;
        });
      }
    });

    return categorized;
  };

  return { members, loading, error };
};

export default useMembers;

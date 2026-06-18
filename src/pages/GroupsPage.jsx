import groups from '../data/groups.json';
import GroupCard from '../components/GroupCard';
import useCountries from '../hooks/useCountries';

export default function GroupsPage() {
  const { byCode } = useCountries();

  return (
    <section className="stack-lg">
      <header>
        <h2>Groups A-L</h2>
        <p>Initial data seed includes one team per group for structure-first delivery.</p>
      </header>
      {groups.map((entry) => {
        const teams = entry.teams.map((code) => byCode[code]).filter(Boolean);
        return <GroupCard key={entry.group} group={entry.group} teams={teams} />;
      })}
    </section>
  );
}

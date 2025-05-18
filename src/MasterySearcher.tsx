import { useRef, useState, type FormEvent } from "react";

export function MasterySearcher() {
    const [masteries, setMasteries] = useState<any[]>([]);
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setMasteries([]);
        setLoading(true);
        try {
            const form = e.currentTarget;
            const formData = new FormData(form);
            const nameTag = (formData.get("nameTag") as string || '').trim();
            const [gameName, tagLine] = nameTag.split("#");
            const region = formData.get("region") as string;
            if (!gameName || !tagLine) {
                setError("Please enter a valid Riot ID (e.g. feiify#ilmbf)");
                setLoading(false);
                return;
            }
            // Step 1: Get PUUID
            const accountRes = await fetch(`/api/riot/account/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`);
            if (!accountRes.ok) {
                setError(`Failed to fetch account info (${accountRes.status})`);
                setLoading(false);
                return;
            }
            const accountData = await accountRes.json();
            const puuid = accountData.puuid;
            if (!puuid) {
                setError("No PUUID found for this Riot ID.");
                setLoading(false);
                return;
            }
            // Step 2: Get Champion Masteries
            const masteryRes = await fetch(`/api/${region}/champion-masteries/${encodeURIComponent(puuid)}`);
            if (!masteryRes.ok) {
                setError(`Failed to fetch champion masteries (${masteryRes.status})`);
                setLoading(false);
                return;
            }
            const masteryData = await masteryRes.json();
            setMasteries(Array.isArray(masteryData) ? masteryData : []);
            setLoading(false);
        } catch (error) {
            setError(String(error));
            setLoading(false);
        }
    };

    return (
        <div className="mt-8 mx-auto w-full max-w-2xl text-left flex flex-col gap-4">
            <form
                onSubmit={handleSubmit}
                className="flex items-center gap-2 bg-[#1a1a1a] p-3 rounded-xl font-mono border-2 border-[#fbf0df] transition-colors duration-300 focus-within:border-[#f3d5a3] w-full"
            >
                <select
                    name="region"
                    className="bg-[#fbf0df] text-[#1a1a1a] py-1.5 px-3 rounded-lg font-bold text-sm min-w-[0px] appearance-none cursor-pointer hover:bg-[#f3d5a3] transition-colors duration-100"
                >
                    <option value="oce" className="py-1">
                        OCE
                    </option>
                    <option value="na" className="py-1">
                        NA
                    </option>
                    <option value="kr" className="py-1">
                        KR
                    </option>
                    <option value="euw" className="py-1">
                        EUW
                    </option>
                </select>
                <input
                    type="text"
                    name="nameTag"
                    className="w-full flex-1 bg-transparent border-0 text-[#fbf0df] font-mono text-base py-1.5 px-2 outline-none focus:text-white placeholder-[#fbf0df]/40"
                    placeholder="Enter Riot ID (e.g. feiify#ilmbf)"
                    required
                />
                <button
                    type="submit"
                    className="bg-[#fbf0df] text-[#1a1a1a] border-0 px-5 py-1.5 rounded-lg font-bold transition-all duration-100 hover:bg-[#f3d5a3] hover:-translate-y-px cursor-pointer whitespace-nowrap"
                >
                    Search
                </button>
            </form>
            {loading && <div className="text-[#fbf0df]">Loading...</div>}
            {error && <div className="text-red-400 whitespace-pre-line">{error}</div>}
            {masteries.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse mt-4">
                        <thead>
                            <tr className="bg-[#1a1a1a] text-[#fbf0df]">
                                <th className="p-2">Icon</th>
                                <th className="p-2">Champion ID</th>
                                <th className="p-2">Level</th>
                                <th className="p-2">Points</th>
                            </tr>
                        </thead>
                        <tbody>
                            {masteries.map((m) => (
                                <tr key={m.championId} className="border-b border-[#fbf0df]/20">
                                    <td className="p-2">
                                        <img
                                            src={`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${m.championId}.png`}
                                            alt={`Champion ${m.championId}`}
                                            style={{ width: 48, height: 48, objectFit: 'contain' }}
                                            loading="lazy"
                                        />
                                    </td>
                                    <td className="p-2">{m.championId}</td>
                                    <td className="p-2">{m.championLevel}</td>
                                    <td className="p-2">{m.championPoints}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
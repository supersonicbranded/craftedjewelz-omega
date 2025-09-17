import React, { useState, useEffect } from "react";

type Script = { name: string; language: string; code: string };

export default function ScriptingPanel() {
	const [scripts, setScripts] = useState<Script[]>([]);
	const [selectedScript, setSelectedScript] = useState<number | null>(null);
	const [output, setOutput] = useState("");

	useEffect(() => {
		// Fetch script list from backend
		fetch("/scripts/list")
			.then(res => res.json())
			.then(data => setScripts(data.scripts || []));
	}, []);

	const handleRun = (idx: number) => {
		const script = scripts[idx];
		fetch("/scripts/run", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ name: script.name, code: script.code, language: script.language })
		})
			.then(res => res.json())
			.then(data => {
				setOutput(data.output || `Script '${script.name}' executed. Output: OK.`);
				setSelectedScript(idx);
			});
	};

	return (
		<section className="panel-card scripting-panel p-4 bg-white border rounded shadow">
			<h2 className="font-bold text-indigo-700 mb-2">Scripting & Automation</h2>
			<ul className="mb-2">
				{scripts.map((script, idx) => (
					<li key={script.name} className="mb-3 p-3 border rounded flex justify-between items-center">
						<div>
							<div className="font-semibold text-indigo-600">{script.name}</div>
							<div className="text-sm text-gray-600">{script.language}</div>
							<pre className="bg-gray-100 p-2 rounded text-xs mt-1">{script.code}</pre>
						</div>
						<button className="btn" onClick={() => handleRun(idx)}>Run</button>
					</li>
				))}
			</ul>
			{selectedScript !== null && (
				<div className="mt-2 p-2 border rounded bg-gray-50">
					<div className="font-semibold text-indigo-600">Output</div>
					<div className="text-sm text-gray-700">{output}</div>
				</div>
			)}
			<div className="mt-4 text-xs text-gray-500">Python/JS scripting and batch automation coming soon.</div>
		</section>
	);
}

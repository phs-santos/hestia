import { useEffect, useState } from "react";

function getRandomTime(extra = 0) {
	const minutes = Math.floor(Math.random() * 5) + 1 + extra;
	const seconds = Math.floor(Math.random() * 59);
	return minutes * 60 + seconds;
}

export function useFakeCountdown() {
	const [time, setTime] = useState(getRandomTime());
	const [resetCount, setResetCount] = useState(0);
	const [coffee, setCoffee] = useState(20); // %

	useEffect(() => {
		const interval = setInterval(() => {
			setTime((prev) => {
				if (prev <= 1) {
					setResetCount((c) => c + 1);
					setCoffee((c) => Math.min(c + 15, 95));
					return getRandomTime(resetCount);
				}
				return prev - 1;
			});
		}, 1000);

		return () => clearInterval(interval);
	}, [resetCount]);

	const minutes = String(Math.floor(time / 60)).padStart(2, "0");
	const seconds = String(time % 60).padStart(2, "0");

	const supervisorMode = resetCount >= 2;

	return {
		time: `${minutes}:${seconds}`,
		resetCount,
		coffee,
		supervisorMode,
	};
}

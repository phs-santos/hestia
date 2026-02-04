// Sound notification using Web Audio API
const playNotificationSound = (soundName: string = 'notification-v1') => {
	try {
		const audio = new Audio(`/${soundName}.mp3`);
		audio.play().catch(error => {
			console.warn('Could not play notification sound (autoplay policy? file missing?):', error);
		});
	} catch (error) {
		console.warn('Could not play notification sound:', error);
	}
};

export const notificationService = {
	requestPermission: async (): Promise<NotificationPermission> => {
		if (!("Notification" in window)) {
			console.warn("This browser does not support desktop notification");
			return "denied";
		}
		return await Notification.requestPermission();
	},

	getPermission: (): NotificationPermission => {
		if (!("Notification" in window)) {
			return "denied";
		}
		return Notification.permission;
	},

	notify: (
		title: string,
		options?: NotificationOptions & {
			playSound?: boolean;
			onClick?: () => void;
			soundName?: string;
			navigateUrl?: string; // URL to navigate when clicked
		}
	) => {
		const { playSound = true, onClick, soundName, navigateUrl, ...notificationOptions } = options || {};

		// Play sound if enabled
		if (playSound) {
			playNotificationSound(soundName);
		}

		// Browser notification
		if (!("Notification" in window)) {
			return null;
		}

		if (Notification.permission === "granted") {
			const notification = new Notification(title, {
				icon: '/logo.png',
				badge: '/logo.png',
				requireInteraction: true,
				...notificationOptions,
			});

			notification.onclick = function (event) {
				event.preventDefault();
				window.focus();
				notification.close();

				// Navigate to URL if provided
				if (navigateUrl) {
					window.location.href = navigateUrl;
				}

				// Execute custom onClick handler
				if (onClick) {
					onClick();
				}
			};

			// Auto close after 20 seconds
			setTimeout(() => notification.close(), 20000);

			return notification;
		}

		return null;
	},

	playSound: playNotificationSound,
};

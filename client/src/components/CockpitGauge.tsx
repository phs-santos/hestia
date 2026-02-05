import React from 'react';

interface CockpitGaugeProps {
    value: number;
    label: string;
    unit?: string;
    color?: string;
    size?: number;
}

export const CockpitGauge: React.FC<CockpitGaugeProps> = ({
    value,
    label,
    unit = '%',
    color = 'var(--primary)',
    size = 120
}) => {
    const radius = size * 0.4;
    const stroke = size * 0.08;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (value / 100) * circumference;

    return (
        <div className="relative flex flex-col items-center justify-center group" style={{ width: size, height: size }}>
            <svg
                height={size}
                width={size}
                className="transform -rotate-90 transition-all duration-1000 ease-out"
            >
                {/* Background Track */}
                <circle
                    stroke="currentColor"
                    fill="transparent"
                    strokeWidth={stroke}
                    strokeDasharray={circumference + ' ' + circumference}
                    style={{ stroke: 'rgba(var(--primary-rgb), 0.1)' }}
                    r={normalizedRadius}
                    cx={size / 2}
                    cy={size / 2}
                />
                {/* Progress Bar */}
                <circle
                    stroke={color}
                    fill="transparent"
                    strokeWidth={stroke}
                    strokeDasharray={circumference + ' ' + circumference}
                    style={{
                        strokeDashoffset,
                        filter: `drop-shadow(0 0 8px ${color})`,
                    }}
                    strokeLinecap="round"
                    r={normalizedRadius}
                    cx={size / 2}
                    cy={size / 2}
                    className="transition-all duration-1000 ease-out"
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-black tracking-tighter" style={{ color }}>
                    {value}{unit}
                </span>
                <span className="text-[12px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">
                    {label}
                </span>
            </div>

            {/* Decorative tech lines */}
            <div className="absolute -inset-1 border border-primary/10 rounded-full pointer-events-none scale-110 opacity-50" />
            <div className="absolute -inset-2 border border-primary/5 rounded-full pointer-events-none scale-125 opacity-30" />
        </div>
    );
};

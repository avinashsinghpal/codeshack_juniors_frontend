'use client';

export default function StatCard({ title, value, icon, color = 'blue' }) {
    const colorClasses = {
        blue: 'bg-x-blue/10 text-x-blue border-x-blue/30',
        green: 'bg-green-500/10 text-green-400 border-green-500/30',
        yellow: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
        red: 'bg-red-500/10 text-red-400 border-red-500/30',
        purple: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    };

    return (
        <div className="bg-x-card rounded-xl p-6 border border-x-border">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-x-text-secondary uppercase">{title}</h3>
                {icon && (
                    <div className={`w-10 h-10 rounded-lg border flex items-center justify-center ${colorClasses[color]}`}>
                        {icon}
                    </div>
                )}
            </div>
            <p className="text-3xl font-bold text-x-text">{value}</p>
        </div>
    );
}

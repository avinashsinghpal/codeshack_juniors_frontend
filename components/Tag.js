export default function Tag({ children, onClick }) {
    return (
        <span
            onClick={onClick}
            className={`inline-block px-3 py-1 rounded-full text-sm bg-x-blue/10 text-x-blue border border-x-blue/20 ${onClick ? 'cursor-pointer hover:bg-x-blue/20 transition-colors' : ''
                }`}
        >
            {children}
        </span>
    );
}

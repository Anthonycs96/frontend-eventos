export default function ColorSelector({ setTheme }) {
    const colors = ['indigo', 'pink', 'green', 'purple', 'yellow'];

    return (
        <div className="flex justify-center space-x-2 mb-8">
            {colors.map((color) => (
                <button
                    key={color}
                    className={`w-8 h-8 rounded-full bg-${color}-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${color}-500`}
                    onClick={() => setTheme(color)}
                />
            ))}
        </div>
    )
}


export default function AppLogo() {
    return (
        <>
            <img
                src="/logo1.png"
                alt="AgriPadi Logo"
                className="size-8 rounded-full object-cover"
            />
            <div className="ml-2 grid flex-1 text-left text-sm">
                <span className="truncate leading-tight font-bold text-base">
                    AgriPadi
                </span>
                <span className="text-xs text-muted-foreground truncate">
                    Empowering Farmers 🌾
                </span>
            </div>
        </>
    );
}
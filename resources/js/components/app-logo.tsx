export default function AppLogo() {
    return (
        <div className="flex items-center gap-2 overflow-hidden">
            <img
                src="/images/logos/VECTO-simbolo-amarillo.png"
                alt="VECTO"
                className="size-7 shrink-0 object-contain"
            />
            <img
                src="/images/logos/VECTO-horizontal-amarillo.png"
                alt="VECTO"
                className="h-5 w-auto object-contain group-data-[collapsible=icon]:hidden"
            />
        </div>
    );
}

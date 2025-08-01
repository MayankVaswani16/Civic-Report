

export function Footer() {
    return (
        <footer className="bg-card border-t border-border">
            <div className="container mx-auto px-6 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-muted-foreground tracking-tight">
                        © 2025 CivicReport. Built for transparent governance.
                    </p>
                    
                    {/* Status Indicator */}
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-chart-1 rounded-full animate-pulse"></div>
                        <span className="text-xs text-muted-foreground font-medium tracking-tight">
                            System Status: Operational
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    )
} 
import { Button } from "@/components/ui/button"
import { Link } from "@tanstack/react-router"

const features = [
    { id: 1, label: "Road Issues", color: "bg-chart-1" },
    { id: 2, label: "Street Lighting", color: "bg-chart-2" },
    { id: 3, label: "Water & Pipes", color: "bg-chart-3" },
    { id: 4, label: "Infrastructure", color: "bg-chart-4" }
]

const mockReports = [
    { id: 1, issue: "Pothole on Main St", time: "2 min ago", status: "urgent", color: "bg-destructive" },
    { id: 2, issue: "Broken streetlight", time: "15 min ago", status: "pending", color: "bg-chart-3" },
    { id: 3, issue: "Water leak reported", time: "1 hour ago", status: "active", color: "bg-chart-1" }
]

export function Hero() {
    return (
        <main className="min-h-screen bg-background relative">
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none"></div>
            
            {/* Hero Section */}
            <section className="container mx-auto px-6 py-16 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <div className="space-y-6 animate-fade-in-up">
                        {/* Title */}
                        <h1 className="text-4xl lg:text-5xl font-bold text-foreground leading-tight tracking-tight">
                            Report Civic Issues.{" "}
                            <br />
                            <span className="text-primary">Track Them.</span>{" "}

                        </h1>
                        
                        {/* Description */}
                        <p className="text-lg text-muted-foreground leading-relaxed max-w-xl font-medium tracking-tight">
                            A smart, transparent platform to report and track local municipal complaints.
                        </p>
                        
                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Button 
                                size="lg" 
                                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold tracking-tight px-8 py-3 text-base"
                                asChild
                            >
                                <Link to="/report">
                                    File a Complaint
                                </Link>
                            </Button>
                            <Button 
                                variant="outline" 
                                size="lg"
                                className="border-border text-foreground hover:bg-accent hover:text-accent-foreground font-semibold tracking-tight px-8 py-3 text-base"
                                asChild
                            >
                                <Link to="/track">
                                    Track My Complaint
                                </Link>
                            </Button>
                        </div>
                        
                        {/* Features */}
                        <div className="flex flex-wrap gap-6 pt-6 text-sm text-muted-foreground font-medium">
                            {features.map((feature) => (
                                <div key={feature.id} className="flex items-center gap-2">
                                    <div className={`w-2 h-2 ${feature.color} rounded-full`}></div>
                                    <span className="tracking-tight">{feature.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Right Visual */}
                    <div className="hidden lg:block animate-fade-in-up-delayed">
                        <div className="relative">
                            {/* Background gradient */}
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 rounded-2xl blur-3xl"></div>
                            
                            {/* Main visual container with primary border glow */}
                            <div className="relative bg-card border border-border rounded-2xl p-8 shadow-lg border-glow-primary">
                                {/* Mock civic dashboard */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-semibold text-foreground tracking-tight">Live Reports</h3>
                                        <span className="text-xs text-muted-foreground">Real-time</span>
                                    </div>
                                    
                                    {/* Mock report items */}
                                    <div className="space-y-3">
                                        {mockReports.map((report, index) => (
                                            <div key={report.id} className={`flex items-center gap-3 p-3 bg-muted/${50 - index * 10} rounded-lg`}>
                                                <div className={`w-3 h-3 ${report.color} rounded-full ${report.status === 'urgent' ? 'animate-pulse' : ''}`}></div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-foreground tracking-tight">{report.issue}</p>
                                                    <p className="text-xs text-muted-foreground">{report.time}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    {/* Mock map area */}
                                    <div 
                                        className="mt-6 h-32 rounded-lg border border-border/50 relative overflow-hidden"
                                        style={{
                                            backgroundImage: 'url(https://img.freepik.com/premium-vector/map-city-vector-illustration_276184-55.jpg)',
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            backgroundRepeat: 'no-repeat'
                                        }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent"></div>
                                        <div className="absolute bottom-2 left-2 flex items-center gap-2">
                                            <div className="w-3 h-3 bg-primary rounded-full shadow-lg"></div>
                                            <p className="text-xs text-foreground font-medium tracking-tight bg-card/90 px-2 py-1 rounded">Live Map</p>
                                        </div>
        
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </main>
    )
}
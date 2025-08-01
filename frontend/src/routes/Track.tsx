import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Search, FileText, Clock, CheckCircle, AlertCircle, Calendar, Hash, Loader2, Filter } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { useGetComplaint } from '@/hooks/useComplaints'
import { useGetComplaints } from '@/hooks/useComplaints'
import { useGetStatuses } from '@/hooks/useStatuses'
import { useProfile } from '@/hooks/useAuth'
import { toast } from 'sonner'

export default function Track() {
    const { data: profile } = useProfile()
    const [trackingId, setTrackingId] = useState('')
    const [isTracking, setIsTracking] = useState(false)
    const [statusFilter, setStatusFilter] = useState('all')

    // Get user's complaints with status filter
    const { data: complaintsData, isLoading: complaintsLoading } = useGetComplaints({
        status: statusFilter === 'all' ? undefined : statusFilter
    })

    // Get statuses for filtering
    const { data: statusesData, isLoading: statusesLoading } = useGetStatuses()

    // Get specific complaint for tracking
    const { data: trackingResult, error: trackingError, refetch: refetchTracking } = useGetComplaint(
        trackingId ? parseInt(trackingId) : 0
    )

    const is_logged_in = !!profile?.user

    const handleTrackSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!trackingId.trim()) return

        setIsTracking(true)
        
        try {
            await refetchTracking()
            if (trackingError) {
                toast.error('Complaint not found. Please check the ID and try again.')
            } else {
                toast.success('Complaint found!')
            }
        } catch (error) {
            toast.error('Failed to track complaint. Please try again.')
        } finally {
            setIsTracking(false)
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'resolved':
                return <CheckCircle className="w-4 h-4" />
            case 'in progress':
                return <Clock className="w-4 h-4" />
            case 'under review':
                return <AlertCircle className="w-4 h-4" />
            default:
                return <FileText className="w-4 h-4" />
        }
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-2xl mx-auto space-y-8">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Track Reports</h1>
                    <p className="text-muted-foreground">
                        Monitor your submitted reports or search by tracking ID
                    </p>
                </div>

                <Card>
                    <CardContent className="p-0">
                        <Tabs defaultValue="track" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 rounded-b-none">
                                <TabsTrigger value="track" className="flex items-center gap-2">
                                    <Search className="w-4 h-4" />
                                    Track by ID
                                </TabsTrigger>
                                <TabsTrigger value="reports" className="flex items-center gap-2">
                                    <FileText className="w-4 h-4" />
                                    My Reports
                                </TabsTrigger>
                            </TabsList>

                            <div className="p-6">
                                <TabsContent value="track" className="space-y-6 mt-0">
                                    <form onSubmit={handleTrackSubmit} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="trackingId" className="text-sm font-medium">
                                                Complaint ID
                                            </Label>
                                            <Input
                                                id="trackingId"
                                                type="number"
                                                placeholder="e.g., 123, 456"
                                                value={trackingId}
                                                onChange={(e) => setTrackingId(e.target.value)}
                                                className="w-full"
                                            />
                                        </div>
                                        <Button type="submit" disabled={isTracking || !trackingId.trim()} className="w-full">
                                            {isTracking ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                                    Tracking...
                                                </>
                                            ) : (
                                                <>
                                                    <Search className="w-4 h-4 mr-2" />
                                                    Track Complaint
                                                </>
                                            )}
                                        </Button>
                                    </form>

                                    {trackingResult?.complaint && (
                                        <Card>
                                            <CardHeader className="pb-3">
                                                <CardTitle className="text-lg">Complaint Details</CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div className="space-y-1">
                                                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                                        Title
                                                    </Label>
                                                    <p className="font-medium">{trackingResult.complaint.title}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                                        Description
                                                    </Label>
                                                    <p className="text-sm leading-relaxed">{trackingResult.complaint.description}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                                        Status
                                                    </Label>
                                                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md border text-sm font-medium`}>
                                                        {getStatusIcon(trackingResult.complaint.status)}
                                                        {trackingResult.complaint.status}
                                                    </div>
                                                </div>
                                                <div className="space-y-1">
                                                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                                        Created Date
                                                    </Label>
                                                    <p className="text-sm">
                                                        {new Date(trackingResult.complaint.created_at).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </p>
                                                </div>
                                                {trackingResult.complaint.location && (
                                                    <div className="space-y-1">
                                                        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                                            Location
                                                        </Label>
                                                        <p className="text-sm">{trackingResult.complaint.location}</p>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    )}

                                    {trackingError && trackingId && (
                                        <Card>
                                            <CardContent className="p-6 text-center">
                                                <div className="space-y-2">
                                                    <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto" />
                                                    <p className="text-muted-foreground">Complaint not found</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Please check the complaint ID and try again
                                                    </p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}
                                </TabsContent>

                                <TabsContent value="reports" className="space-y-6 mt-0">
                                    <div className="space-y-4">
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                            <h3 className="font-semibold">Your Reports</h3>
                                            
                                            {/* Filter Section */}
                                            <div className="flex items-center gap-2">
                                                <Filter className="w-4 h-4 text-muted-foreground" />
                                                <select
                                                    value={statusFilter}
                                                    onChange={(e) => setStatusFilter(e.target.value)}
                                                    className="px-3 py-1.5 text-sm bg-background border border-input rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                                    disabled={statusesLoading}
                                                >
                                                    <option value="all">All Status</option>
                                                    {statusesData?.statuses.map((status) => (
                                                        <option key={status.id} value={status.name}>
                                                            {status.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                {statusesLoading && (
                                                    <p className="text-xs text-muted-foreground">Loading statuses...</p>
                                                )}
                                            </div>
                                        </div>
                                        
                                        {!is_logged_in ? (
                                            <Card>
                                                <CardContent className="p-8 text-center">
                                                    <div className="space-y-4">
                                                        <div className="space-y-2">
                                                            <p className="text-foreground">Please log in to view your reports</p>
                                                            <p className="text-sm text-muted-foreground">
                                                                Access your account to track and manage your submitted reports
                                                            </p>
                                                        </div>
                                                        <Button className="mx-auto" asChild>
                                                            <Link to="/login">
                                                                Log In
                                                            </Link>
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ) : complaintsLoading ? (
                                            <Card>
                                                <CardContent className="p-8 text-center">
                                                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                                                    <p className="text-muted-foreground">Loading your reports...</p>
                                                </CardContent>
                                            </Card>
                                        ) : complaintsData?.complaints && complaintsData.complaints.length > 0 ? (
                                            <div className="space-y-3">
                                                {complaintsData.complaints.map((complaint) => (
                                                    <Card key={complaint.id} className="hover:bg-accent/50 transition-colors">
                                                        <CardContent className="p-4">
                                                            <div className="flex justify-between items-start gap-4">
                                                                <div className="space-y-1 min-w-0 flex-1">
                                                                    <div className="flex items-center gap-2 flex-wrap">
                                                                        <h4 className="font-medium truncate">{complaint.title}</h4>
                                                                        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-md flex items-center gap-1">
                                                                            <Hash className="w-3 h-3" />
                                                                            {complaint.id}
                                                                        </span>
                                                                    </div>
                                                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                                        <Calendar className="w-3 h-3" />
                                                                        {new Date(complaint.created_at).toLocaleDateString('en-US', {
                                                                            year: 'numeric',
                                                                            month: 'short',
                                                                            day: 'numeric'
                                                                        })}
                                                                    </p>
                                                                </div>
                                                                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-muted-foreground text-xs font-medium`}>
                                                                    {getStatusIcon(complaint.status)}
                                                                    {complaint.status}
                                                                </div>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </div>
                                        ) : (
                                            <Card>
                                                <CardContent className="p-8 text-center">
                                                    <div className="space-y-2">
                                                        <p className="text-muted-foreground">
                                                            {statusFilter === 'all' ? 'No reports found' : `No ${statusFilter} reports found`}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {statusFilter === 'all' 
                                                                ? 'Submit your first report to get started'
                                                                : 'Try changing the filter or submit a new report'
                                                            }
                                                        </p>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        )}
                                    </div>
                                </TabsContent>
                            </div>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

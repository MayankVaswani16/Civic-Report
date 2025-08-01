import { useState, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Search, FileText, Clock, CheckCircle, Users, AlertCircle, Loader2 } from 'lucide-react'
import { useGetStats } from '@/hooks/useStats'
import { useGetComplaints } from '@/hooks/useComplaints'
import { useSearchComplaints } from '@/hooks/useComplaints'
import { useGetStatuses } from '@/hooks/useStatuses'
import { useProfile } from '@/hooks/useAuth'    

export default function AdminPanel() {
    const navigate = useNavigate()
    const [searchTerm, setSearchTerm] = useState('')
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    
    // All hooks must be called before any conditional returns
    const { data: profileData, isLoading: profileLoading } = useProfile()
    const { data: statsData, isLoading: statsLoading } = useGetStats()
    const { data: complaintsData, isLoading: complaintsLoading } = useGetComplaints({
        status: statusFilter === 'all' ? undefined : statusFilter
    })
    const { data: searchData, isLoading: searchLoading } = useSearchComplaints({
        query: debouncedSearchTerm
    })
    const { data: statusesData } = useGetStatuses()

    // Debounce search term
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm)
        }, 300)

        return () => clearTimeout(timer)
    }, [searchTerm])

    // Early returns after all hooks
    if (profileLoading) {
        return (
            <div className="flex items-center justify-center min-h-[40vh]">
                <Card>
                    <CardContent className="p-8 flex flex-col items-center">
                        <Loader2 className="w-8 h-8 animate-spin mb-4 text-muted-foreground" />
                        <span className="text-muted-foreground text-lg font-medium">Loading your profile...</span>
                    </CardContent>
                </Card>
            </div>
        )
    }
    
    if (profileData?.user.role !== 'admin') {
        return (
            <div className="flex items-center justify-center min-h-[40vh]">
                <Card>
                    <CardContent className="p-8 flex flex-col items-center">
                        <AlertCircle className="w-10 h-10 mb-4 text-muted-foreground" />
                        <span className="text-lg font-semibold mb-2">Access Denied</span>
                        <span className="text-muted-foreground text-center">
                            You are not authorized to access this page.
                        </span>
                    </CardContent>
                </Card>
            </div>
        )
    }

    // Derived state and helper functions
    const statusOptions = ['all', ...(statusesData?.statuses.map(s => s.name) || [])]
    const displayData = debouncedSearchTerm ? searchData?.complaints : complaintsData?.complaints
    const isLoading = debouncedSearchTerm ? searchLoading : complaintsLoading

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending': return <Clock className="w-4 h-4" />
            case 'resolved': return <CheckCircle className="w-4 h-4" />
            case 'in progress': return <Clock className="w-4 h-4" />
            case 'under review': return <AlertCircle className="w-4 h-4" />
            default: return <FileText className="w-4 h-4" />
        }
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>
                    <p className="text-muted-foreground">
                        Manage and track all civic reports from the community
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Card>
                        <CardContent className="p-6 text-center">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <FileText className="w-5 h-5 text-muted-foreground" />
                                <div className="text-2xl font-bold text-foreground">
                                    {statsLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : statsData?.stats.total_reports || 0}
                                </div>
                            </div>
                            <div className="text-sm text-muted-foreground">Total Reports</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6 text-center">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <Clock className="w-5 h-5 text-muted-foreground" />
                                <div className="text-2xl font-bold text-foreground">
                                    {statsLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : statsData?.stats.pending_reports || 0}
                                </div>
                            </div>
                            <div className="text-sm text-muted-foreground">Pending</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6 text-center">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <CheckCircle className="w-5 h-5 text-muted-foreground" />
                                <div className="text-2xl font-bold text-foreground">
                                    {statsLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : statsData?.stats.resolved_reports || 0}
                                </div>
                            </div>
                            <div className="text-sm text-muted-foreground">Resolved</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <Label htmlFor="search" className="text-sm font-medium">
                                    Search Reports
                                </Label>
                                <div className="relative mt-1">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="search"
                                        placeholder="Search by title, description, or status..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                                {debouncedSearchTerm && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Searching for: "{debouncedSearchTerm}"
                                    </p>
                                )}
                            </div>
                            <div className="sm:w-48">
                                <Label htmlFor="status-filter" className="text-sm font-medium">
                                    Filter by Status
                                </Label>
                                <select
                                    id="status-filter"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="w-full mt-1 px-3 py-2 text-sm bg-background border border-input rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                >
                                    {statusOptions.map(status => (
                                        <option key={status} value={status}>
                                            {status === 'all' ? 'All Status' : status}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Reports List */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold">
                            Reports ({displayData?.length || 0})
                            {debouncedSearchTerm && (
                                <span className="text-sm text-muted-foreground ml-2">
                                    (search results)
                                </span>
                            )}
                        </h3>
                    </div>

                    {isLoading ? (
                        <Card>
                            <CardContent className="p-8 text-center">
                                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                                <p className="text-muted-foreground">
                                    {debouncedSearchTerm ? 'Searching...' : 'Loading reports...'}
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-3">
                            {displayData?.map((complaint) => (
                                <Card 
                                    key={complaint.id} 
                                    className="hover:bg-accent/50 transition-colors cursor-pointer" 
                                    onClick={() => {
                                        navigate({
                                            to: "/admin/report/$id",
                                            params: { id: complaint.id.toString() }
                                        })
                                    }}
                                >
                                    <CardContent className="p-4">
                                        <div className="flex justify-between items-start gap-4">
                                            <div className="space-y-1 min-w-0 flex-1">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <h4 className="font-medium">{complaint.title}</h4>
                                                    <Badge variant="outline" className="text-xs">
                                                        {complaint.id}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-muted-foreground line-clamp-1">
                                                    {complaint.description}
                                                </p>
                                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        <Users className="w-3 h-3" />
                                                        User: {complaint.user_name}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <AlertCircle className="w-3 h-3" />
                                                        Category: {complaint.category_name}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {new Date(complaint.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 px-2 py-1 rounded-lg border border-muted-foreground text-xs font-medium">
                                                {getStatusIcon(complaint.status)}
                                                {complaint.status}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}

                    {!isLoading && (!displayData || displayData.length === 0) && (
                        <Card>
                            <CardContent className="p-8 text-center">
                                <div className="space-y-2">
                                    <FileText className="w-12 h-12 mx-auto text-muted-foreground opacity-50" />
                                    <p className="text-muted-foreground">
                                        {debouncedSearchTerm ? 'No search results found' : 'No reports found'}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {debouncedSearchTerm 
                                            ? 'Try adjusting your search terms'
                                            : 'No reports match your current criteria'
                                        }
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    )
} 
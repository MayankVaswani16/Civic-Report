import { useState, useEffect } from 'react'
import { Link, useParams } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Save, Mail, MapPin, Calendar, User, FileText, AlertCircle, Clock, CheckCircle, Loader2 } from 'lucide-react'
import { useGetComplaint } from '@/hooks/useComplaints'
import { useGetStatuses } from '@/hooks/useStatuses'
import { useGetUser, useUpdateComplaint } from '@/hooks/useAuth'
import { toast } from 'sonner'

export default function AdminReportDetail() {
  const { id } = useParams({ from: '/admin/report/$id' })
  const [editableFields, setEditableFields] = useState({
    status: '',
    notes: ''
  })

  // Get complaint data
  const { data: complaintData, isLoading, error } = useGetComplaint(parseInt(id))

  // Get statuses for admin controls
  const { data: statusesData } = useGetStatuses()

  // Get user data for the complaint
  const { data: userData, isLoading: userLoading } = useGetUser(complaintData?.complaint?.user_id || 0)

  // Update complaint mutation
  const updateComplaintMutation = useUpdateComplaint()

  useEffect(() => {
    if (complaintData?.complaint) {
      setEditableFields({
        status: complaintData.complaint.status,
        notes: ''
      })
    }
  }, [complaintData])

  const statusOptions = statusesData?.statuses.map(s => s.name) || []

  const handleFieldChange = (field: keyof typeof editableFields, value: string) => {
    setEditableFields(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = async () => {
    updateComplaintMutation.mutate({
      complaintId: parseInt(id),
      data: {
        status: editableFields.status
      }
    }, {
      onSuccess: () => {
        toast.success('Report updated successfully!')
      },
      onError: () => {
        toast.error('Failed to update report. Please try again.')
      }
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return <Clock className="w-4 h-4" />
      case 'resolved': return <CheckCircle className="w-4 h-4" />
      case 'in progress': return <Clock className="w-4 h-4" />
      case 'under review': return <AlertCircle className="w-4 h-4" />
      default: return <FileText className="w-4 h-4" />
    }
  }

  const hasChanges = () => {
    if (!complaintData?.complaint) return false
    return (
      editableFields.status !== complaintData.complaint.status ||
      editableFields.notes !== ''
    )
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading report details...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (error || !complaintData?.complaint) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="space-y-4">
                <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground opacity-50" />
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold">Report Not Found</h2>
                  <p className="text-muted-foreground">
                    The report you're looking for doesn't exist or has been removed.
                  </p>
                </div>
                <Button asChild>
                  <Link to="/admin">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back 
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const complaint = complaintData.complaint

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="sm">
            <Link to="/admin">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight">Report Details</h1>
          </div>
          <Badge variant="outline" className="text-sm">
            {complaint.id}
          </Badge>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">{complaint.title}</h3>
                  <div className="flex gap-2 mb-4">
                    <Badge variant="outline" className="flex items-center gap-1">
                      {getStatusIcon(editableFields.status)}
                      {editableFields.status}
                    </Badge>
                    <Badge variant="outline">Category: {complaint.category_name}</Badge>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                  <p className="mt-1 text-sm leading-relaxed">{complaint.description}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Submitted:</span>
                    <span>{new Date(complaint.created_at).toLocaleDateString()}</span>
                  </div>
                  {complaint.location && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Location:</span>
                      <span>{complaint.location}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Reporter Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Reporter Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">User ID</Label>
                    <p className="mt-1">{complaint.user_id}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Category</Label>
                    <p className="mt-1">{complaint.category_name}</p>
                  </div>
                  {userLoading ? (
                    <div className="md:col-span-2">
                      <Label className="text-sm font-medium text-muted-foreground">User Details</Label>
                      <p className="mt-1 text-muted-foreground">Loading user information...</p>
                    </div>
                  ) : userData?.user ? (
                    <>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Name</Label>
                        <p className="mt-1">{userData.user.name}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                        <p className="mt-1">{userData.user.email}</p>
                      </div>
                    </>
                  ) : (
                    <div className="md:col-span-2">
                      <Label className="text-sm font-medium text-muted-foreground">User Details</Label>
                      <p className="mt-1 text-muted-foreground">User information not available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Image if available */}
            {complaint.image_url && (
              <Card>
                <CardHeader>
                  <CardTitle>Attached Image</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted rounded-lg p-4 text-center">
                    <div className="w-full h-64 bg-muted/50 rounded-lg flex items-center justify-center">
                      <span className="text-muted-foreground">Image placeholder</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Report image uploaded by user {complaint.user_id}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Admin Controls */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Admin Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="status" className="text-sm font-medium">Status</Label>
                  <select
                    id="status"
                    value={editableFields.status}
                    onChange={(e) => handleFieldChange('status', e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-sm bg-background border border-input rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {statusOptions.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>


                <Button
                  onClick={handleSave}
                  disabled={!hasChanges() || updateComplaintMutation.isPending}
                  className="w-full"
                >
                  {updateComplaintMutation.isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>

                {hasChanges() && (
                  <p className="text-xs text-muted-foreground text-center">
                    You have unsaved changes
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  asChild
                  disabled={!userData?.user?.email}
                >
                  <a href={`mailto:${userData?.user?.email || ''}`}>
                    <Mail className="w-4 h-4 mr-2" />
                    Email Reporter
                  </a>
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <MapPin className="w-4 h-4 mr-2" />
                  View on Map
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 
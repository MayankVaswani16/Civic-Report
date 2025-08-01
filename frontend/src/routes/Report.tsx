import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PlusCircle, Loader2, CheckCircle } from 'lucide-react'
import { useGetCategories } from '@/hooks/useCategories'
import { useCreateComplaint } from '@/hooks/useComplaints'
import { toast } from 'sonner'

export default function Report() {
    const { data: categoriesData, isLoading: categoriesLoading } = useGetCategories()
    const createComplaintMutation = useCreateComplaint()
    
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category_id: '',
        location: '',
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submittedComplaintId, setSubmittedComplaintId] = useState<number | null>(null)

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.title.trim() || !formData.description.trim() || !formData.category_id) return

        setIsSubmitting(true)
        setSubmittedComplaintId(null) // Clear previous complaint ID

        try {
            // Prepare complaint data
            const complaintData = {
                category_id: parseInt(formData.category_id),
                title: formData.title,
                description: formData.description,
                location: formData.location,
            }

            const response = await createComplaintMutation.mutateAsync(complaintData)
            setSubmittedComplaintId(response.complaint_id)
            
            // Reset form
            setFormData({
                title: '',
                description: '',
                category_id: '',
                location: '',
            })

            toast.success('Report submitted successfully!')
        } catch (error) {
            toast.error('Failed to submit report. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const isFormValid = formData.title.trim() && formData.description.trim() && formData.category_id

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-2xl mx-auto space-y-8">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Submit Report</h1>
                    <p className="text-muted-foreground">
                        Report civic issues in your community
                    </p>
                </div>

                <Card>
                    <CardContent className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title" className="text-sm font-medium">
                                    Report Title *
                                </Label>
                                <Input
                                    id="title"
                                    type="text"
                                    placeholder="e.g., Broken streetlight on Oak Avenue"
                                    value={formData.title}
                                    onChange={(e) => handleInputChange('title', e.target.value)}
                                    className="w-full"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-sm font-medium">
                                    Description *
                                </Label>
                                <textarea
                                    id="description"
                                    placeholder="Provide detailed description of the issue..."
                                    value={formData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    rows={4}
                                    className="w-full min-h-[100px] px-3 py-2 text-sm bg-background border border-input rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category" className="text-sm font-medium">
                                    Category *
                                </Label>
                                <select
                                    id="category"
                                    value={formData.category_id}
                                    onChange={(e) => handleInputChange('category_id', e.target.value)}
                                    className="w-full px-3 py-2 text-sm bg-background border border-input rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    disabled={categoriesLoading}
                                >
                                    <option value="">Select a category...</option>
                                    {categoriesData?.categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                                {categoriesLoading && (
                                    <p className="text-xs text-muted-foreground">Loading categories...</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="location" className="text-sm font-medium">
                                    Location
                                </Label>
                                <Input
                                    id="location"
                                    type="text"
                                    placeholder="e.g., 123 Oak Avenue, Downtown District"
                                    value={formData.location}
                                    onChange={(e) => handleInputChange('location', e.target.value)}
                                    className="w-full"
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={isSubmitting || !isFormValid || categoriesLoading}
                                className="w-full"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                        Submitting Report...
                                    </>
                                ) : (
                                    <>
                                        <PlusCircle className="w-4 h-4 mr-2" />
                                        Submit Report
                                    </>
                                )}
                            </Button>

                            {/* Success Message with Complaint ID */}
                            {submittedComplaintId && (
                                <div className="mt-4 p-4 report-success-message">
                                    <div className="flex items-center gap-3">
                                        <CheckCircle className="w-5 h-5 text-foreground" />
                                        <div>
                                            <p className="text-base font-semibold text-foreground mb-1">
                                                Report submitted successfully!
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Complaint ID: <span className="font-mono font-semibold">{submittedComplaintId}</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

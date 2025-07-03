import { useState } from 'react'
import { 
  MapPin, 
  Building, 
  Mail, 
  Phone, 
  Globe, 
  User,
  Edit,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react'
import { giveService } from '../services/giveService'
import toast from 'react-hot-toast'

const GiveCard = ({ 
  give, 
  isOwner = false, 
  onEdit, 
  onDelete, 
  onToggleStatus,
  showContactInfo = false 
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [contactInfo, setContactInfo] = useState(null)
  const [loadingContact, setLoadingContact] = useState(false)

  const handleContactInfo = async () => {
    if (contactInfo) {
      setContactInfo(null)
      return
    }

    setLoadingContact(true)
    try {
      const response = await giveService.getContactInfo(give.id)
      setContactInfo(response.data)
    } catch (error) {
      toast.error('Failed to load contact information')
    } finally {
      setLoadingContact(false)
    }
  }

  const handleToggleStatus = async () => {
    try {
      await giveService.toggleStatus(give.id)
      onToggleStatus && onToggleStatus(give.id)
      toast.success(`Give ${give.is_active ? 'deactivated' : 'activated'} successfully`)
    } catch (error) {
      toast.error('Failed to update status')
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this Give?')) {
      try {
        await giveService.deleteGive(give.id)
        onDelete && onDelete(give.id)
        toast.success('Give deleted successfully')
      } catch (error) {
        toast.error('Failed to delete Give')
      }
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="card-header">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">{give.name}</h3>
            <div className="flex items-center mt-1 text-sm text-gray-600">
              <Building className="h-4 w-4 mr-1" />
              {give.company}
            </div>
            <div className="flex items-center mt-1 text-sm text-gray-600">
              <MapPin className="h-4 w-4 mr-1" />
              {give.location}
            </div>
          </div>
          
          {isOwner && (
            <div className="flex space-x-2">
              <button
                onClick={() => onEdit(give)}
                className="p-1 text-gray-400 hover:text-primary-600 transition-colors"
                title="Edit"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={handleDelete}
                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                title="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
            {give.category}
          </span>
          <span className="text-xs text-gray-500">
            {formatDate(give.created_at)}
          </span>
        </div>
      </div>

      <div className="card-content">
        {give.description && (
          <p className="text-gray-700 text-sm mb-4">{give.description}</p>
        )}

        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <Mail className="h-4 w-4 mr-2" />
            <span>{give.email}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Phone className="h-4 w-4 mr-2" />
            <span>{give.phone}</span>
          </div>
          {give.website && (
            <div className="flex items-center text-sm text-gray-600">
              <Globe className="h-4 w-4 mr-2" />
              <a 
                href={give.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary-600 hover:underline"
              >
                {give.website}
              </a>
            </div>
          )}
        </div>

        {showContactInfo && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-600">
                <User className="h-4 w-4 mr-2" />
                <span>Created by: {give.user.first_name} {give.user.last_name}</span>
              </div>
              <button
                onClick={handleContactInfo}
                disabled={loadingContact}
                className="btn btn-sm btn-outline"
              >
                {loadingContact ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
                ) : contactInfo ? (
                  <>
                    <EyeOff className="h-4 w-4 mr-1" />
                    Hide Contact
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-1" />
                    Contact Creator
                  </>
                )}
              </button>
            </div>
            
            {contactInfo && (
              <div className="mt-3 p-3 bg-gray-50 rounded-md">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-gray-700">{contactInfo.mobile}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-gray-700">{contactInfo.email}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {isOwner && (
        <div className="card-footer">
          <button
            onClick={handleToggleStatus}
            className={`btn btn-sm ${
              give.is_active 
                ? 'btn-secondary' 
                : 'btn-primary'
            }`}
          >
            {give.is_active ? 'Deactivate' : 'Activate'}
          </button>
        </div>
      )}
    </div>
  )
}

export default GiveCard 
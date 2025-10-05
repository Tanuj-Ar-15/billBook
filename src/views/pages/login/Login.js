import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CSpinner,
  CAlert,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser, cilDollar, cilChart } from '@coreui/icons'
import { Eye, EyeOff } from 'lucide-react' // 👈 Lucide icons
import useAuthStore from '../../../store/authStore'

const Login = () => {
  const { user, login, isLoading, error } = useAuthStore()
  const [formData, setFormData] = useState({ username: '', password: '' })
  const [touched, setTouched] = useState({ username: false, password: false })
  const [showPassword, setShowPassword] = useState(false) // 👈 password visibility toggle

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleBlur = (e) => {
    const { name } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setTouched({ username: true, password: true })
    if (formData.username && formData.password) {
      await login(formData.username, formData.password)
    }
  }

  const isUsernameValid = formData.username || !touched.username
  const isPasswordValid = formData.password || !touched.password

  return (
    <div className="bg-gradient-primary min-vh-100 d-flex flex-row align-items-center justify-content-center p-3">
      <CContainer fluid>
        <CRow className="justify-content-center">
          <CCol xs={12} sm={10} md={8} lg={6} xl={4}>
            {/* App Branding */}
            <div className="text-center mb-4">
              <div className="d-flex align-items-center justify-content-center mb-3">
                <div className="bg-white rounded-3 p-2 shadow-sm me-3">
                  <CIcon icon={cilDollar} className="text-primary" size="xxl" />
                </div>
                <div>
                  <h1 className="h2 text-white fw-bold mb-0">InvoicePro</h1>
                  <small className="text-white-50">Billing & Invoicing Software</small>
                </div>
              </div>
            </div>

            <CCard className="shadow-lg border-0 rounded-4 overflow-hidden">
              <div className="bg-primary py-3">
                <h4 className="text-white text-center mb-0 fw-semibold">
                  <CIcon icon={cilChart} className="me-2" />
                  Secure Login
                </h4>
              </div>

              <CCardBody className="p-4 p-sm-5">
                {error && (
                  <CAlert color="danger" className="rounded-3 mb-4">
                    <strong>Error:</strong> {error}
                  </CAlert>
                )}

                <CForm onSubmit={handleSubmit}>
                  {/* Username Field */}
                  <CInputGroup className="mb-3">
                    <CInputGroupText className="bg-light border-end-0">
                      <CIcon icon={cilUser} className="text-primary" />
                    </CInputGroupText>
                    <CFormInput
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Username or Email"
                      autoComplete="username"
                      className={`border-start-0 ${!isUsernameValid ? 'is-invalid' : ''}`}
                      required
                      disabled={isLoading}
                    />
                    {!isUsernameValid && (
                      <div className="invalid-feedback d-block">Please enter your username</div>
                    )}
                  </CInputGroup>

                  {/* Password Field with Eye Toggle */}
                  <CInputGroup className="mb-3 position-relative">
                    <CInputGroupText className="bg-light border-end-0">
                      <CIcon icon={cilLockLocked} className="text-primary" />
                    </CInputGroupText>

                    <CFormInput
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Password"
                      autoComplete="current-password"
                      className={`border-start-0 ${!isPasswordValid ? 'is-invalid' : ''}`}
                      required
                      disabled={isLoading}
                    />

                    <CInputGroupText
                      role="button"
                      className="bg-light border-start-0"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff size={18} className="text-secondary" />
                      ) : (
                        <Eye size={18} className="text-secondary" />
                      )}
                    </CInputGroupText>

                    {!isPasswordValid && (
                      <div className="invalid-feedback d-block">Please enter your password</div>
                    )}
                  </CInputGroup>

                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <a href="#" className="text-decoration-none small text-primary">
                      Forgot password?
                    </a>
                  </div>

                  <div className="d-grid mb-3">
                    
                    <CButton
                      type="submit"
                      color="primary"
                      className="py-3 fw-semibold rounded-3"
                      disabled={isLoading || !formData.username || !formData.password}
                    >
                      {isLoading ? (
                        <>
                          <CSpinner component="span" size="sm" className="me-2" />
                          Signing in...
                        </>
                      ) : (
                        'Sign In to Dashboard'
                      )}
                    </CButton>
                  </div>

                  {/* Features List */}
                  <div className="row text-center mt-4">
                    <div className="col-4">
                      <div className="text-primary">
                        <CIcon icon={cilDollar} size="lg" />
                      </div>
                      <small className="text-muted">Invoicing</small>
                    </div>
                    <div className="col-4">
                      <div className="text-primary">
                        <CIcon icon={cilChart} size="lg" />
                      </div>
                      <small className="text-muted">Reports</small>
                    </div>
                    <div className="col-4">
                      <div className="text-primary">
                        <CIcon icon={cilLockLocked} size="lg" />
                      </div>
                      <small className="text-muted">Secure</small>
                    </div>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>

            {/* Footer */}
            <div className="text-center mt-4">
              <small className="text-white-50">© 2025 InvoicePro. All rights reserved.</small>
            </div>
          </CCol>
        </CRow>
      </CContainer>

    </div>
  )
}

export default Login

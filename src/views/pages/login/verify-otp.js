import React, { useState, useEffect, useRef } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CRow,
  CSpinner,
  CAlert,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilClock, cilShieldAlt } from '@coreui/icons'
import { Mail } from 'lucide-react'

const OTPVerification = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [timeLeft, setTimeLeft] = useState(900)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [canResend, setCanResend] = useState(false)
  const inputRefs = useRef([])

  const userEmail = 'user@example.com'

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [timeLeft])

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    if (value && index < 5) inputRefs.current[index + 1]?.focus()
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pasteData = e.clipboardData.getData('text').slice(0, 6)
    if (/^\d+$/.test(pasteData)) {
      const newOtp = [...otp]
      pasteData.split('').forEach((char, index) => {
        if (index < 6) newOtp[index] = char
      })
      setOtp(newOtp)
      inputRefs.current[Math.min(pasteData.length - 1, 5)]?.focus()
    }
  }

  const handleVerify = async (e) => {
    e.preventDefault()
    const otpString = otp.join('')
    if (otpString.length !== 6) {
      setError('Please enter the complete 6-digit OTP')
      return
    }
    setIsLoading(true)
    setError('')
    try {
      await new Promise((res) => setTimeout(res, 2000))
      if (otpString === '123456') setSuccess('Email verified successfully! Redirecting...')
      else setError('Invalid OTP code. Please try again.')
    } catch {
      setError('Verification failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOtp = async () => {
    setIsLoading(true)
    setError('')
    setSuccess('')
    try {
      await new Promise((res) => setTimeout(res, 1000))
      setOtp(['', '', '', '', '', ''])
      setTimeLeft(900)
      setCanResend(false)
      setSuccess('New OTP has been sent to your email!')
      inputRefs.current[0]?.focus()
    } catch {
      setError('Failed to resend OTP. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const maskedEmail = () => {
    const [localPart, domain] = userEmail.split('@')
    const maskedLocal = localPart[0] + '*'.repeat(localPart.length - 2) + localPart.slice(-1)
    return `${maskedLocal}@${domain}`
  }

  return (
    <div className="bg-gradient-primary min-vh-100 d-flex align-items-center justify-content-center p-3">
      <CContainer fluid className="d-flex justify-content-center">
        <CRow className="justify-content-center w-100">
          <CCol xs={12} sm={10} md={6} lg={5} xl={4}>
            {/* Branding */}
            <div className="text-center mb-4">
              <div className="d-flex align-items-center justify-content-center mb-3">
                <div className="bg-white rounded-circle p-3 shadow-sm">
                  <CIcon icon={cilShieldAlt} className="text-primary" size="xxl" />
                </div>
              </div>
              <h3 className="text-white fw-bold mb-1">Verify Email</h3>
              <p className="text-white-50 mb-0">Enter the 6-digit code sent to your email</p>
            </div>

            <CCard className="shadow border-0 rounded-3 overflow-hidden">
              <div className="bg-primary py-2">
                <h5 className="text-white text-center mb-0 fw-semibold">
                  <CIcon icon={cilLockLocked} className="me-2" />
                  OTP Verification
                </h5>
              </div>

              <CCardBody className="p-3 p-sm-4">
                <div className="text-center mb-3">
                  <div className="d-inline-flex align-items-center bg-light rounded-3 px-2 py-1">
                    <Mail size={16} className="text-primary me-2" />
                    <small className="text-muted fw-semibold">{maskedEmail()}</small>
                  </div>
                </div>

                {error && (
                  <CAlert color="danger" className="rounded-3 mb-3 py-2">
                    <strong>Error:</strong> {error}
                  </CAlert>
                )}
                {success && (
                  <CAlert color="success" className="rounded-3 mb-3 py-2">
                    <strong>Success:</strong> {success}
                  </CAlert>
                )}

                <CForm onSubmit={handleVerify}>
                  {/* OTP Inputs */}
                  <div className="mb-3 d-flex justify-content-between gap-2 flex-wrap">
                    {otp.map((digit, index) => (
                      <CFormInput
                        key={index}
                        type="text"
                        inputMode="numeric"
                        maxLength="1"
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={handlePaste}
                        ref={(el) => (inputRefs.current[index] = el)}
                        className="text-center fw-bold fs-6 py-2 flex-fill"
                        style={{
                          height: '50px',
                          maxWidth: 'calc(16% - 4px)',
                          minWidth: '40px',
                          flexGrow: 1,
                        }}
                        disabled={isLoading}
                        autoFocus={index === 0}
                      />
                    ))}
                  </div>

                  {/* Timer */}
                  <div className="text-center mb-3">
                    <div className="d-inline-flex align-items-center bg-light rounded-3 px-2 py-1">
                      <CIcon icon={cilClock} className="text-warning me-1" />
                      <small className="text-muted fw-semibold">
                        Expires in: <span className="text-danger">{formatTime(timeLeft)}</span>
                      </small>
                    </div>
                  </div>

                  {/* Verify Button */}
                  <div className="d-grid mb-2">
                    <CButton
                      type="submit"
                      color="primary"
                      className="py-2 fw-semibold rounded-3"
                      disabled={isLoading || otp.join('').length !== 6}
                    >
                      {isLoading ? (
                        <>
                          <CSpinner component="span" size="sm" className="me-2" />
                          Verifying...
                        </>
                      ) : (
                        'Verify Email'
                      )}
                    </CButton>
                  </div>

                  {/* Resend OTP */}
                  <div className="text-center">
                    <small className="text-muted">
                      Didn't receive code?{' '}
                      {canResend ? (
                        <a
                          href="#"
                          className="text-decoration-none text-primary fw-semibold"
                          onClick={handleResendOtp}
                        >
                          Resend
                        </a>
                      ) : (
                        <span className="text-muted">Resend in {formatTime(timeLeft)}</span>
                      )}
                    </small>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>

            {/* Footer */}
            <div className="text-center mt-3">
              <small className="text-white-50">© 2025 InvoicePro. All rights reserved.</small>
            </div>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default OTPVerification

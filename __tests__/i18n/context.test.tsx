import { render, screen, fireEvent } from '@testing-library/react'
import { LanguageProvider, useLanguage } from '@/lib/i18n/context'

function TestConsumer() {
  const { locale, setLocale } = useLanguage()
  return (
    <div>
      <span data-testid="locale">{locale}</span>
      <button onClick={() => setLocale('en')}>Switch to EN</button>
    </div>
  )
}

describe('LanguageProvider', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('defaults to fr', () => {
    render(
      <LanguageProvider>
        <TestConsumer />
      </LanguageProvider>
    )
    expect(screen.getByTestId('locale').textContent).toBe('fr')
  })

  it('updates locale on setLocale', () => {
    render(
      <LanguageProvider>
        <TestConsumer />
      </LanguageProvider>
    )
    fireEvent.click(screen.getByText('Switch to EN'))
    expect(screen.getByTestId('locale').textContent).toBe('en')
  })

  it('persists locale to localStorage', () => {
    render(
      <LanguageProvider>
        <TestConsumer />
      </LanguageProvider>
    )
    fireEvent.click(screen.getByText('Switch to EN'))
    expect(localStorage.getItem('minilek_locale')).toBe('en')
  })
})

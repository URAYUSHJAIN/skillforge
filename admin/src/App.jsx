import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar/Navbar'
import DasboardPage from './components/DasboardPage/DasboardPage'
import ListPage from './components/ListPage/ListPage'
import AddPage from './components/AddPage/AddPage'
import BookingsPage from './components/BookingsPage/BookingsPage'
import ContactsPage from './components/ContactsPage/ContactsPage'

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DasboardPage />
      case 'courses':
        return <ListPage />
      case 'add-course':
        return <AddPage />
      case 'bookings':
        return <BookingsPage />
      case 'contacts':
        return <ContactsPage />
      default:
        return <DasboardPage />
    }
  }

  return (
    <div className="admin-app">
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="admin-content">
        {renderPage()}
      </main>
    </div>
  )
}

export default App

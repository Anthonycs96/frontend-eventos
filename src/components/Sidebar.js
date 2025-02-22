'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Calendar, MessageSquare, LayoutDashboard } from 'lucide-react'

export function Sidebar() {
    const pathname = usePathname()

    const links = [
        { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/eventos', label: 'Eventos', icon: Calendar },
        { href: '/mensajes', label: 'Mensajes', icon: MessageSquare },
    ]

    return (
        <div className="w-64 bg-white border-r h-screen">
            <div className="p-6">
                <h1 className="text-2xl font-bold text-gray-800">EventPro</h1>
            </div>
            <nav className="px-4 space-y-2">
                {links.map(({ href, label, icon: Icon }) => (
                    <Link
                        key={href}
                        href={href}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${pathname === href
                                ? 'bg-primary text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        <Icon size={20} />
                        <span>{label}</span>
                    </Link>
                ))}
            </nav>
        </div>
    )
}


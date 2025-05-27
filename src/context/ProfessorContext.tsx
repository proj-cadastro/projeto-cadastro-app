'use client'

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react'
import { Professor } from "../types/professor"
import { getProfessors } from '../services/professors/professorService'


type ProfessorContextType = {
    professors: Professor[]
    loading: boolean
    refreshProfessorsData: () => void
}

export const ProfessorContext = createContext<ProfessorContextType | undefined>(undefined)

export const ProfessorProvider = ({ children }: { children: ReactNode }) => {
    const [professors, setProfessors] = useState<Professor[]>([])
    const [loading, setLoading] = useState(true)

    const fetchData = useCallback(async () => {
        try {
            const professoresData = await getProfessors()
            setProfessors(professoresData)
        } catch (error: any) {
            console.error(error.response?.error?.messagem || "Erro ao carregar professores")
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    return (
        <ProfessorContext.Provider value={{ professors, loading, refreshProfessorsData: fetchData }}>
            {children}
        </ProfessorContext.Provider>
    )
}

export const useProfessor = () => {
    const context = useContext(ProfessorContext)

    if (!context) throw new Error("useProfessor must be used within ProfessorProvider")

    return context
}

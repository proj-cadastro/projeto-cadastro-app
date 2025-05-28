'use client'

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react'
import { Professor } from "../types/professor"
import { getProfessors } from '../services/professors/professorService'


type ProfessorContextType = {
    professors: Professor[]
    loading: boolean
    refreshProfessorsData: () => void
    getProfessorById: (id: number) => Professor | undefined
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
            //contornando o erro 404 do backend para listas vazias
            const msg = error.response?.data?.mensagem

            if (msg === "Nenhum professor encontrado") {
                setProfessors([])
            } else {
                console.error(msg )
            }
            //##
        } finally {
            setLoading(false)
        }
    }, [])

    const fetchDataById = (id: number): Professor | undefined => {
        return professors.find(professor => professor.id === id)
    }

    useEffect(() => {
        fetchData()
    }, [fetchData])

    return (
        <ProfessorContext.Provider value={{ professors, loading, refreshProfessorsData: fetchData, getProfessorById: fetchDataById }}>
            {children}
        </ProfessorContext.Provider>
    )
}

export const useProfessor = () => {
    const context = useContext(ProfessorContext)

    if (!context) throw new Error("useProfessor must be used within ProfessorProvider")

    return context
}

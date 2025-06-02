'use client'

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react'
import { Professor } from "../types/professor"
import { getProfessors, getProfessorsByName as getProfessorsByNameService } from '../services/professors/professorService'


type ProfessorContextType = {
    professors: Professor[]
    loading: boolean
    refreshProfessorsData: () => void
    getProfessorById: (id: number) => Professor | undefined
    getProfessorsByName: (nome: string, cursos: string[], titulacoes: string[]) => Promise<void>
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

const getProfessorsByName = useCallback(async (nome: string, cursos: string[], titulacoes: string[]) => {
    try {
        const professoresData = await getProfessorsByNameService(nome, cursos, titulacoes);
        setProfessors(professoresData);
    } catch (error: any) {
        const msg = error.response?.data?.mensagem;
        if (msg === "Nenhum professor encontrado") {
            setProfessors([]);
        } else {
            console.error(msg);
        }
    }
}, []);

    const fetchDataById = (id: number): Professor | undefined => {
        return professors.find(professor => professor.id === id)
    }

    useEffect(() => {
        fetchData()
    }, [fetchData])

    return (
        <ProfessorContext.Provider value={{ professors, loading, refreshProfessorsData: fetchData, getProfessorById: fetchDataById, getProfessorsByName }}>
            {children}
        </ProfessorContext.Provider>
    )


}

export const useProfessor = () => {
    const context = useContext(ProfessorContext)

    if (!context) throw new Error("useProfessor must be used within ProfessorProvider")

    return context
}

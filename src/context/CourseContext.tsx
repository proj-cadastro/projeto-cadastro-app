'use client'

import { getCourses } from "../services/course/cursoService"
import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react'
import { Course } from "../types/courses"

type CourseContextType = {
    courses: Course[]
    loading: boolean
    refreshCoursesData: () => void
}

export const CourseContext = createContext<CourseContextType | undefined>(undefined)

export const CourseProvider = ({ children }: { children: ReactNode }) => {
    const [courses, setCourses] = useState<Course[]>([])
    const [loading, setLoading] = useState(true)

    const fetchData = useCallback(async () => {
        try {
            const coursesData = await getCourses()
            setCourses(coursesData)
        } catch (error: any) {
            console.error(error.response.error.messagem)
        } finally {
            setLoading(false)
        }
    }, [])


    useEffect(() => {
        fetchData()
    }, [fetchData])

    return (
        <CourseContext.Provider value={{ courses, loading, refreshCoursesData: fetchData }}>
            {children}
        </CourseContext.Provider>
    )
}

export const useCourse = () => {
    const context = useContext(CourseContext)

    if (!context) throw new Error("useCourses must be used within CourseProvider")

    return context
}
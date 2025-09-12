'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "../ui/button";
import { Filter, Search, Users, DollarSign } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useRef } from 'react';

export type ActiveTabAlunos = "Visão Geral" | "Controle de Pagamentos";

const tabs: { label: ActiveTabAlunos; icon: React.ElementType }[] = [
    { label: "Visão Geral", icon: Users },
    { label: "Controle de Pagamentos", icon: DollarSign },
];

export default function Filters() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();
    const timeoutRef = useRef<NodeJS.Timeout>();
    
    const activeTab = (searchParams.get('tab') || 'Visão Geral') as ActiveTabAlunos;

    const handleTabChange = (tab: ActiveTabAlunos) => {
        const params = new URLSearchParams(searchParams);
        params.set('tab', tab);
        router.replace(`${pathname}?${params.toString()}`);
    };

    const handleSearch = useCallback((term: string) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        
        timeoutRef.current = setTimeout(() => {
            const params = new URLSearchParams(searchParams);
            if (term) {
                params.set('query', term);
            } else {
                params.delete('query');
            }
            router.replace(`${pathname}?${params.toString()}`);
        }, 300);
    }, [searchParams, pathname, router]);

    const handleStatusChange = (status: string) => {
        const params = new URLSearchParams(searchParams);
        if (status && status !== 'all') {
            params.set('status', status);
        } else {
            params.delete('status');
        }
        router.replace(`${pathname}?${params.toString()}`);
    };

    return (
        <>
            <div className="flex flex-wrap items-center gap-2 border-b pb-2">
                {tabs.map((tab) => (
                    <Button 
                        key={tab.label} 
                        variant={activeTab === tab.label ? "secondary" : "ghost"} 
                        onClick={() => handleTabChange(tab.label)}
                        className="font-normal text-muted-foreground data-[state=active]:text-foreground data-[state=active]:font-semibold"
                        data-state={activeTab === tab.label ? 'active' : 'inactive'}
                    >
                        <tab.icon className="mr-2 h-4 w-4" />
                        {tab.label}
                    </Button>
                ))}
            </div>
            {activeTab === 'Visão Geral' && (
                <Card>
                    <CardContent className="p-4 flex flex-col md:flex-row items-center gap-4">
                        <div className="relative w-full md:flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                                placeholder="Buscar por nome, email ou CPF..." 
                                className="pl-9" 
                                onChange={(e) => handleSearch(e.target.value)}
                                defaultValue={searchParams.get('query')?.toString()}
                            />
                        </div>
                        <div className="flex gap-4 w-full md:w-auto">
                            <Select onValueChange={handleStatusChange} defaultValue={searchParams.get('status')?.toString() || 'all'}>
                                <SelectTrigger className="w-full md:w-[180px]">
                                    <SelectValue placeholder="Todos os Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos os Status</SelectItem>
                                    <SelectItem value="ativo">Ativo</SelectItem>
                                    <SelectItem value="inativo">Inativo</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button variant="outline" className="w-full md:w-auto">
                                <Filter className="mr-2 h-4 w-4" />
                                Filtros
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </>
    )
}

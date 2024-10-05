"use client"

import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import { Trash2 } from "lucide-react"

type Quote = {
  company: string
  price: number | null
}

const initialCompanies = [
  "LA POSITIVA",
  "MAPFRE",
  "RIMAC",
  "PROTECTA",
  "PACIFICO",
  "QUALITAS"
]

const usoOptions = ["PARTICULAR", "CARGA", "COMERCIAL", "TRANS PERSONAL"]

const circulacionOptions = [
  "AREQUIPA", "LA LIBERTAD", "AMAZONAS", "ANCASH", "APURIMAC", "AYACUCHO", "CAJAMARCA",
  "CUSCO", "HUANCAVELICA", "HUANUCO", "ICA", "JUNIN", "LAMBAYEQUE", "LIMA", "LORETO",
  "MADRE DE DIOS", "MOQUEGUA", "PASCO", "PIURA", "PUNO", "SAN MARTIN", "TACNA", "TUMBES",
  "CALLAO", "UCAYALI"
]

const claseOptions = [
  "AUTOMOVIL",
  "CAM. PICK UP",
  "CAM. RURAL",
  "CAM. ST. WAGON",
  "MICROBUS",
  "MINIBUS",
  "OMNIBUS",
  "CAMION",
  "VOLQUETE",
  "BARANDA",
  "CAM. PANEL",
  "FURGON",
  "REMOLCADOR",
  "MOTOCICLETA"
]

export function SoatQuoteManager() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [availableCompanies, setAvailableCompanies] = useState<string[]>(initialCompanies)
  const [selectedCompany, setSelectedCompany] = useState<string>("")
  const [price, setPrice] = useState<string>("")
  const [uso, setUso] = useState<string>("")
  const [circulacion, setCirculacion] = useState<string>("")
  const [clase, setClase] = useState<string>("")
  const [cliente, setCliente] = useState<string>("")
  const [nro, setNro] = useState<string>("")
  const [referencia, setReferencia] = useState<string>("")
  const [fechaInicio, setFechaInicio] = useState<string>(new Date().toISOString().split('T')[0])
  const priceInputRef = useRef<HTMLInputElement>(null)
  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    setAvailableCompanies(initialCompanies.filter(company => 
      !quotes.some(quote => quote.company === company)
    ))
  }, [quotes])

  const addQuote = () => {
    if (selectedCompany) {
      const newQuote: Quote = {
        company: selectedCompany,
        price: price ? Math.round(parseFloat(price)) : null
      }
      setQuotes(prevQuotes => [...prevQuotes, newQuote])
      setSelectedCompany("")
      setPrice("")
      if (priceInputRef.current) priceInputRef.current.focus()
    }
  }

  const removeQuote = (index: number) => {
    setQuotes(prevQuotes => prevQuotes.filter((_, i) => i !== index))
  }

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-')
    return `${day}/${month}/${year}`
  }

  const copyQuotes = () => {
    const quotesText = quotes
      .sort((a, b) => {
        if (a.price === null) return 1
        if (b.price === null) return -1
        return a.price - b.price
      })
      .map(q => `${q.company} ${q.price ? `S/ ${q.price}` : 'NO COTIZA'}`)
      .join('\n')

    const text = `${cliente ? `${cliente}\n` : ''}${nro ? `${nro}\n\n` : ''}INICIO ${formatDate(fechaInicio)}\n\n${clase}\n${quotesText}\n\n${uso}\n${circulacion}`
    
    if (textAreaRef.current) {
      textAreaRef.current.value = text
      textAreaRef.current.select()
      try {
        document.execCommand('copy')
        toast({
          title: "Cotizaciones copiadas",
          description: "Las cotizaciones han sido copiadas al portapapeles."
        })
      } catch (err) {
        console.error('Error al copiar: ', err)
        toast({
          title: "Error al copiar",
          description: "No se pudieron copiar las cotizaciones. Por favor, inténtalo de nuevo.",
          variant: "destructive"
        })
      }
    }
  }

  const createSubject = () => {
    const subject = `COTIZACION SOAT ${uso} // ${referencia || 'SIN REFERENCIA'} // ${cliente || 'SIN CLIENTE'}`
    if (textAreaRef.current) {
      textAreaRef.current.value = subject
      textAreaRef.current.select()
      try {
        document.execCommand('copy')
        toast({
          title: "Asunto creado",
          description: "El asunto ha sido copiado al portapapeles."
        })
      } catch (err) {
        console.error('Error al copiar: ', err)
        toast({
          title: "Error al copiar",
          description: "No se pudo copiar el asunto. Por favor, inténtalo de nuevo.",
          variant: "destructive"
        })
      }
    }
  }

  const clearData = () => {
    setCliente("")
    setNro("")
    setReferencia("")
    setFechaInicio(new Date().toISOString().split('T')[0])
    setClase("")
    setUso("")
    setCirculacion("")
    toast({
      title: "Datos eliminados",
      description: "Los datos del cliente y vehículo han sido eliminados."
    })
  }

  const clearQuotes = () => {
    setQuotes([])
    setSelectedCompany("")
    setPrice("")
    toast({
      title: "Cotizaciones eliminadas",
      description: "Todas las cotizaciones han sido eliminadas."
    })
  }

  const clearAll = () => {
    clearData()
    clearQuotes()
    toast({
      title: "Todo eliminado",
      description: "Todos los datos y cotizaciones han sido eliminados."
    })
  }

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Cotizaciones SOAT</CardTitle>
        <Button onClick={clearAll} variant="destructive" size="sm">
          Limpiar Todo
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Input
              placeholder="Cliente (Opcional)"
              value={cliente}
              onChange={e => setCliente(e.target.value)}
            />
            <Input
              placeholder="Nro (Opcional)"
              value={nro}
              onChange={e => setNro(e.target.value)}
            />
            <Input
              placeholder="Referencia (Opcional)"
              value={referencia}
              onChange={e => setReferencia(e.target.value)}
            />
            <Input
              type="date"
              value={fechaInicio}
              onChange={e => setFechaInicio(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
            <Select value={clase} onValueChange={setClase}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione clase" />
              </SelectTrigger>
              <SelectContent>
                {claseOptions.map(option => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={uso} onValueChange={setUso}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione uso" />
              </SelectTrigger>
              <SelectContent>
                {usoOptions.map(option => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={circulacion} onValueChange={setCirculacion}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione circulación" />
              </SelectTrigger>
              <SelectContent>
                {circulacionOptions.map(option => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex space-x-2">
              <Button onClick={clearData} className="flex-1 bg-yellow-500 hover:bg-yellow-600">
                Limpiar Datos
              </Button>
              <Button onClick={createSubject} className="flex-1 bg-green-500 hover:bg-green-600">
                Crear Asunto
              </Button>
            </div>
          </div>
          <div className="space-y-4">
            <Select value={selectedCompany} onValueChange={setSelectedCompany}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione compañía" />
              </SelectTrigger>
              <SelectContent>
                {availableCompanies.map(company => (
                  <SelectItem key={company} value={company}>{company}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              ref={priceInputRef}
              type="number"
              placeholder="Precio"
              value={price}
              onChange={e => setPrice(e.target.value)}
            />
            <Button onClick={addQuote} className="w-full">Agregar Cotización</Button>
            <ScrollArea className="h-[200px] w-full rounded-md border p-4">
              {quotes.sort((a, b) => {
                if (a.price === null) return 1
                if (b.price === null) return -1
                return a.price - b.price
              }).map((quote, index) => (
                <div key={index} className="flex justify-between items-center mb-2">
                  <span>{quote.company} {quote.price ? `S/ ${quote.price}` : 'NO COTIZA'}</span>
                  <Button variant="ghost" size="icon" onClick={() => removeQuote(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </ScrollArea>
            <div className="flex space-x-2">
              <Button onClick={copyQuotes} className="flex-1">Copiar</Button>
              <Button onClick={clearQuotes} className="flex-1 bg-orange-500 hover:bg-orange-600">
                Limpiar Cotización
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
      <textarea
        ref={textAreaRef}
        style={{position: 'absolute', left: '-9999px'}}
        aria-hidden="true"
      />
    </Card>
  )
}
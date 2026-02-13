"use client"

import { useState, useRef, useEffect } from "react"
import { QRCodeSVG } from "qrcode.react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

export default function QRCodeGenerator() {
    const [url, setUrl] = useState("https://gumelar.web.id")
    const [qrCode, setQRCode] = useState("https://gumelar.web.id")
    const [color, setColor] = useState("#000000")
    const [backgroundColor, setBackgroundColor] = useState("#ffffff")
    const [size, setSize] = useState(200)

    const svgRef = useRef<SVGSVGElement>(null)

    const generateQRCode = (e: React.FormEvent) => {
        e.preventDefault()
        setQRCode(url)
    }

    const downloadQRCodePNG = () => {
        if (!svgRef.current) return

        const svg = svgRef.current
        const svgData = new XMLSerializer().serializeToString(svg)

        const canvas = document.createElement("canvas")
        canvas.width = size
        canvas.height = size
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        const img = new Image()
        img.onload = () => {
            ctx.fillStyle = backgroundColor
            ctx.fillRect(0, 0, size, size)
            ctx.drawImage(img, 0, 0, size, size)

            const pngUrl = canvas.toDataURL("image/png")
            const link = document.createElement("a")
            link.href = pngUrl
            link.download = "qr-code.png"
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        }
        img.onerror = (err) => {
            console.error("Failed to convert SVG to PNG", err)
        }
        img.src = "data:image/svg+xml;base64," + btoa(svgData)
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">QR Code Generator</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={generateQRCode} className="space-y-4">
                        <div>
                            <Label htmlFor="url">Text/URL</Label>
                            <Input
                                id="url"
                                type="text"
                                placeholder="Enter a URL"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                required
                                className="w-full"
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="color">QR Code Color</Label>
                                <Input
                                    id="color"
                                    type="color"
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                    className="w-full h-10"
                                />
                            </div>
                            <div>
                                <Label htmlFor="backgroundColor">Background Color</Label>
                                <Input
                                    id="backgroundColor"
                                    type="color"
                                    value={backgroundColor}
                                    onChange={(e) => setBackgroundColor(e.target.value)}
                                    className="w-full h-10"
                                />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="size">
                                Size: {size}x{size}
                            </Label>
                            <Slider
                                id="size"
                                min={100}
                                max={400}
                                step={10}
                                value={[size]}
                                onValueChange={(value) => setSize(value[0])}
                                className="w-full"
                            />
                        </div>
                        <Button type="submit" className="w-full">
                            Generate QR Code
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col items-center gap-4">
                    {qrCode && (
                        <>
                            <QRCodeSVG
                                ref={svgRef}
                                value={qrCode}
                                size={size}
                                fgColor={color}
                                bgColor={backgroundColor}
                                includeMargin={true}
                            />
                            <Button onClick={downloadQRCodePNG} className="mt-2">
                                Download QR Code (PNG)
                            </Button>
                        </>
                    )}
                </CardFooter>
            </Card>
        </div>
    )
}

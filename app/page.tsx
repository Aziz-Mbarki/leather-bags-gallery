import Header from "@/components/header"
import ProductGallery from "@/components/product-gallery"
import CustomBagSection from "@/components/custom-bag-section"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <ProductGallery />
        <CustomBagSection />
      </div>
      <Footer />
    </main>
  )
}

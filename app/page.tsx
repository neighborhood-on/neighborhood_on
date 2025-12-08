import Header from '@/components/Header'
import Hero from '@/components/Hero'
import FeatureShowcase from '@/components/FeatureShowcase'
import TeamSection from '@/components/TeamSection'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <div className="container-fluid">
      <Header />

      <main>
        <Hero />
        <FeatureShowcase />
        <TeamSection />
      </main>

      <Footer />
    </div>
  )
}

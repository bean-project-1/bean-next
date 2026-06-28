// =======================================================
// BEAN — Terms and Conditions Page
// apps/web/app/terms/page.tsx
// =======================================================
import Link from 'next/link';

const C = {
  cream:   '#F7F4EE',
  creamDk: '#F0EBE0',
  ink:     '#1A1A1A',
  green:   '#10b981',
  muted:   '#6B6B6B',
  border:  '#E8E3D8',
  ghost:   '#BFBAB0',
};

function SeedIcon({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <ellipse cx="14" cy="15" rx="8" ry="10" fill={C.green} opacity="0.15" />
      <path d="M14 24 C14 24 6 18 6 11 C6 7 9.5 4 14 4 C18.5 4 22 7 22 11 C22 18 14 24 14 24Z" fill={C.green} opacity="0.9" />
      <path d="M14 24 L14 12" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M14 17 C14 17 10 14 10 11" stroke="#fff" strokeWidth="0.8" strokeLinecap="round" opacity="0.7" />
      <path d="M14 15 C14 15 18 12 18 9" stroke="#fff" strokeWidth="0.8" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}

export default function TermsPage() {
  return (
    <div style={{ backgroundColor: C.cream, color: C.ink }} className="min-h-screen font-sans antialiased selection:bg-emerald-200 selection:text-emerald-900 pb-20">
      
      {/* NAV */}
      <nav className="border-b" style={{ borderColor: C.border }}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="flex items-center gap-2 outline-none hover:opacity-85 transition-opacity">
            <SeedIcon size={26} />
            <span className="font-serif text-xl font-bold tracking-tight" style={{ color: C.ink }}>BEAN</span>
          </Link>
          <Link href="/" className="text-sm font-medium transition-opacity hover:opacity-60" style={{ color: C.muted }}>
            Volver al Inicio
          </Link>
        </div>
      </nav>

      {/* CONTENT */}
      <main className="mx-auto max-w-4xl px-6 py-12 md:py-16">
        <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight mb-3" style={{ color: C.ink }}>
          Términos y Condiciones
        </h1>
        <p className="text-sm mb-10" style={{ color: C.muted }}>
          Última actualización: 28 de junio de 2026
        </p>

        <div className="space-y-8 text-stone-800 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-bold font-serif" style={{ color: C.ink }}>1. Aceptación de los Términos</h2>
            <p>
              Bienvenido a BEAN (la "Plataforma"). Al acceder o utilizar nuestra aplicación web, software y servicios relacionados (en adelante, los "Servicios"), usted acepta cumplir y estar sujeto a los siguientes Términos y Condiciones (los "Términos").
            </p>
            <p>
              Si no está de acuerdo con alguno de estos Términos, por favor no utilice la Plataforma. Nos reservamos el derecho de modificar estos Términos en cualquier momento, y el uso continuado de los Servicios constituirá su aceptación de dichas modificaciones.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold font-serif" style={{ color: C.ink }}>2. Descripción del Servicio</h2>
            <p>
              BEAN es una plataforma digital de inteligencia de vida diseñada para ayudar a los usuarios a entender, planificar y optimizar sus dimensiones personales (identidad, capital, compromisos y experiencia) mediante herramientas de productividad, agenda interactiva y soporte de análisis automatizado e Inteligencia Artificial (nuestro "AI Coach").
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold font-serif" style={{ color: C.ink }}>3. Registro de Cuentas y Seguridad</h2>
            <p>
              Para acceder a la mayoría de las funciones de la Plataforma, debe registrarse y crear una cuenta utilizando su correo electrónico o a través de su cuenta de Google.
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Usted se compromete a proporcionar información de registro precisa, completa y actualizada.</li>
              <li>Es responsable de mantener la seguridad y confidencialidad de su contraseña y del acceso general a su cuenta.</li>
              <li>Debe notificarnos de inmediato cualquier uso no autorizado o sospechoso de su cuenta.</li>
              <li>El uso de las cuentas es personal e intransferible.</li>
            </ul>
          </section>

          <section className="pl-4 border-l-2 py-2 bg-stone-100/50 rounded-r-xl space-y-3" style={{ borderColor: C.green }}>
            <h2 className="text-xl font-bold font-serif text-stone-950">4. Descargo de Responsabilidad de Inteligencia Artificial (AI Coach)</h2>
            <p>
              BEAN integra herramientas de Inteligencia Artificial para ofrecer sugerencias, resúmenes, ideas y coaching de estilo de vida.
            </p>
            <p className="font-semibold text-stone-900">
              Usted comprende y acepta que:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Las respuestas e interpretaciones de la IA se proporcionan únicamente con fines informativos, de organización y de reflexión personal.</li>
              <li>El AI Coach de BEAN <strong>no proporciona</strong>, ni pretende sustituir, el asesoramiento profesional médico, terapéutico, psicológico, legal, financiero, fiscal o de inversión.</li>
              <li>Cualquier decisión tomada o acción emprendida basándose en las sugerencias del AI Coach es bajo su propia responsabilidad y riesgo. Siempre debe consultar con profesionales calificados para decisiones críticas relacionadas con su salud mental, física o finanzas.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold font-serif" style={{ color: C.ink }}>5. Integraciones de Terceros (Google Calendar y OAuth)</h2>
            <p>
              La Plataforma permite opcionalmente la integración con servicios externos como Google Calendar. Al autorizar esta integración, nos concede permiso para acceder, leer y escribir eventos en su calendario para las funciones de sincronización de su agenda personal.
            </p>
            <p>
              El funcionamiento correcto de estas integraciones depende de la disponibilidad y APIs de los proveedores correspondientes (Google). BEAN no se hace responsable de interrupciones del servicio externas o errores en el procesamiento de datos causados por plataformas de terceros.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold font-serif" style={{ color: C.ink }}>6. Propiedad Intelectual</h2>
            <p>
              Todo el diseño de la interfaz, el software, la marca BEAN, el código fuente, los logotipos, los textos y los gráficos en la Plataforma son propiedad exclusiva de BEAN o de sus licenciantes y están protegidos por leyes de propiedad intelectual internacionales y locales.
            </p>
            <p>
              Usted conserva la propiedad de todo el contenido, datos de usuario, compromisos y metas que ingrese en la Plataforma. Nos otorga una licencia limitada e irrevocable únicamente para alojar y procesar este contenido para poder proveer el Servicio.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold font-serif" style={{ color: C.ink }}>7. Conducta del Usuario y Restricciones</h2>
            <p>
              Usted se compromete a no utilizar la Plataforma para:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Eludir o burlar las medidas de seguridad de la Plataforma.</li>
              <li>Intentar descompilar, hacer ingeniería inversa o extraer código de nuestros Servicios.</li>
              <li>Utilizar bots, scrapers o sistemas automatizados de manera abusiva o sin autorización expresa.</li>
              <li>Subir información falsa, ilegal, pornográfica, difamatoria o que infrinja derechos de propiedad intelectual de terceros.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold font-serif" style={{ color: C.ink }}>8. Terminación de Cuentas</h2>
            <p>
              Nos reservamos el derecho de suspender o cancelar su cuenta y acceso a los Servicios a nuestra entera discreción, sin previo aviso, en caso de incumplimiento de estos Términos, actividades ilegales o por razones operativas.
            </p>
            <p>
              Del mismo modo, usted puede dar de baja su cuenta en cualquier momento contactando con nosotros.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold font-serif" style={{ color: C.ink }}>9. Limitación de Responsabilidad</h2>
            <p>
              En la máxima medida permitida por la ley aplicable, BEAN no será responsable de daños indirectos, incidentales, especiales, consecuentes o punitivos, ni de la pérdida de beneficios o ingresos, pérdida de datos, uso, buena voluntad u otras pérdidas intangibles que resulten del uso o la imposibilidad de uso de la Plataforma.
            </p>
            <p>
              Nuestros Servicios se proporcionan "tal cual" y "según disponibilidad", sin garantías de ningún tipo, expresas o implícitas.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold font-serif" style={{ color: C.ink }}>10. Modificaciones a los Términos</h2>
            <p>
              Podemos modificar estos Términos en cualquier momento. Siempre indicaremos la fecha de última actualización al principio del documento. Le recomendamos revisar este documento con frecuencia para mantenerse informado.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold font-serif" style={{ color: C.ink }}>11. Contacto</h2>
            <p>
              Si tiene alguna pregunta o aclaración respecto a estos Términos y Condiciones, puede comunicarse con nosotros en:
            </p>
            <p className="font-semibold">
              Email: <a href="mailto:soporte@bean.co" className="underline hover:text-emerald-600 transition-colors">soporte@bean.co</a>
            </p>
          </section>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4 px-8 py-6 border-t mt-12"
        style={{ borderColor: C.border }}>
        <p className="text-xs" style={{ color: C.ghost }}>© {new Date().getFullYear()} BEAN — Inteligencia de Vida.</p>
        <div className="flex gap-8">
          <Link href="/privacy" className="text-xs transition-opacity hover:opacity-60" style={{ color: C.ghost }}>Privacidad</Link>
          <Link href="/terms" className="text-xs transition-opacity hover:opacity-60" style={{ color: C.ghost }}>Términos</Link>
        </div>
      </footer>

    </div>
  );
}

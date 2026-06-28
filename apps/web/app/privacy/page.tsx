// =======================================================
// BEAN — Privacy Policy Page
// apps/web/app/privacy/page.tsx
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

export default function PrivacyPage() {
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
          Política de Privacidad
        </h1>
        <p className="text-sm mb-10" style={{ color: C.muted }}>
          Última actualización: 28 de junio de 2026
        </p>

        <div className="space-y-8 text-stone-800 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-bold font-serif" style={{ color: C.ink }}>1. Introducción</h2>
            <p>
              En BEAN ("nosotros", "nuestro"), valoramos su confianza y nos comprometemos a proteger su privacidad. Esta Política de Privacidad describe cómo recopilamos, utilizamos, almacenamos y protegemos su información personal cuando utiliza nuestra plataforma, la aplicación web y cualquier servicio relacionado (en adelante, los "Servicios").
            </p>
            <p>
              Al utilizar BEAN, usted acepta los términos descritos en esta política. Si no está de acuerdo, por favor no acceda ni utilice nuestros Servicios.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold font-serif" style={{ color: C.ink }}>2. Información que Recopilamos</h2>
            <p>
              Recopilamos información sobre usted de tres formas principales: cuando nos la proporciona directamente, automáticamente al usar la plataforma, y a través de servicios de terceros como Google.
            </p>
            
            <div className="pl-4 border-l-2 py-1 space-y-3" style={{ borderColor: C.green }}>
              <h3 className="font-bold text-stone-900">Uso de Datos de Google OAuth (Google Sign-In)</h3>
              <p>
                Si decide registrarse o iniciar sesión utilizando su cuenta de Google, recopilamos la siguiente información básica asociada a su cuenta:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong>Dirección de correo electrónico:</strong> Para identificar su cuenta única y enviarle notificaciones esenciales sobre el servicio.</li>
                <li><strong>Nombre completo y foto de perfil:</strong> Para personalizar su perfil en la plataforma y mejorar su experiencia de uso.</li>
                <li><strong>Identificador de Google:</strong> Un código único proporcionado por Google para mantener su sesión de forma segura.</li>
              </ul>
              <p>
                Además, si otorga permisos adicionales explícitos para <strong>Google Calendar</strong> (Calendario de Google), recopilaremos y procesaremos información sobre sus eventos de calendario únicamente para la sincronización con su agenda de compromisos de BEAN.
              </p>
            </div>

            <p>
              <strong>Información proporcionada directamente:</strong> Si decide registrarse con correo electrónico tradicional, recopilamos su nombre, correo electrónico y contraseña (debidamente encriptada). También recopilamos las metas, tareas, compromisos y hábitos que decida ingresar en la plataforma.
            </p>
            <p>
              <strong>Información recopilada automáticamente:</strong> Recopilamos información de diagnóstico técnico para garantizar el correcto funcionamiento del servicio (dirección IP, tipo de navegador, sistema operativo y páginas visitadas).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold font-serif" style={{ color: C.ink }}>3. Cómo Utilizamos su Información</h2>
            <p>
              El propósito principal de utilizar su información es ofrecerle una plataforma de desarrollo personal inteligente. Esto incluye:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Crear, mantener y personalizar su cuenta.</li>
              <li>Sincronizar sus tareas y compromisos de vida con Google Calendar (si ha concedido el permiso correspondiente).</li>
              <li>Alimentar el coach de inteligencia artificial para proveer recomendaciones, análisis y reflexiones de vida personalizadas.</li>
              <li>Enviar notificaciones y recordatorios importantes del servicio.</li>
              <li>Detectar, prevenir y solucionar problemas técnicos o de seguridad.</li>
            </ul>
          </section>

          <section className="pl-4 border-l-2 py-2 bg-stone-100/50 rounded-r-xl space-y-3" style={{ borderColor: C.green }}>
            <h2 className="text-xl font-bold font-serif text-stone-950">4. Cumplimiento de Datos de Google y No Comercialización</h2>
            <p className="font-semibold text-stone-900">
              Uso Limitado y Privacidad Rigurosa:
            </p>
            <p>
              El uso de la información recibida a través de las APIs de Google por parte de BEAN cumple estrictamente con la <strong>Política de Datos del Usuario de los Servicios de la API de Google</strong> (Google API Services User Data Policy), incluidos los requisitos de Uso Limitado (Limited Use Requirements).
            </p>
            <p>
              <strong>No comercialización:</strong> Bajo ninguna circunstancia vendemos, alquilamos, comercializamos ni transferimos sus datos de usuario de Google a terceros para marketing, publicidad o monetización de ningún tipo. La información de Google se procesa exclusivamente dentro de nuestra plataforma para brindarle las herramientas de productividad y coaching personal.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold font-serif" style={{ color: C.ink }}>5. Compartición de Información con Terceros</h2>
            <p>
              Solo compartimos su información personal en las siguientes situaciones:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Proveedores de Servicios de Confianza:</strong> Compartimos información técnica mínima y metadatos estrictamente necesarios con nuestros proveedores de infraestructura en la nube (como bases de datos alojadas y plataformas de hosting) y APIs de inteligencia artificial (como OpenAI), las cuales procesan sus consultas al chat coach de forma confidencial.</li>
              <li><strong>Cumplimiento de la ley:</strong> Si es requerido por una orden judicial u otra obligación gubernamental válida.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold font-serif" style={{ color: C.ink }}>6. Seguridad y Retención de Datos</h2>
            <p>
              Implementamos medidas de seguridad técnicas y organizativas para proteger su información contra accesos no autorizados, pérdidas o alteraciones. Esto incluye el uso de cifrado SSL/TLS, almacenamiento seguro de contraseñas y control de accesos.
            </p>
            <p>
              Conservamos sus datos personales durante el tiempo que sea necesario para cumplir con los fines descritos en esta política o hasta que decida eliminar su cuenta.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold font-serif" style={{ color: C.ink }}>7. Sus Derechos (Control sobre sus Datos)</h2>
            <p>
              Usted tiene el derecho de acceder, rectificar o eliminar su información personal en cualquier momento.
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Puede modificar su perfil y desconectar su cuenta de Google o de Google Calendar desde los ajustes de su perfil dentro de BEAN.</li>
              <li>Puede solicitar la eliminación definitiva de su cuenta y de todos los datos personales asociados enviando un correo electrónico a nuestro equipo de soporte a <a href="mailto:soporte@bean.co" className="font-semibold underline hover:text-emerald-600 transition-colors">soporte@bean.co</a>.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold font-serif" style={{ color: C.ink }}>8. Cambios en esta Política</h2>
            <p>
              Podemos actualizar nuestra Política de Privacidad de vez en cuando. Le notificaremos cualquier cambio publicando la nueva Política de Privacidad en esta página e indicando la fecha de última actualización en la parte superior. Le recomendamos revisar esta página periódicamente.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold font-serif" style={{ color: C.ink }}>9. Contacto</h2>
            <p>
              Si tiene preguntas, comentarios o inquietudes sobre esta Política de Privacidad o el tratamiento de sus datos personales, puede ponerse en contacto con nosotros en:
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

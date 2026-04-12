<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="VECTO® — Plataforma SaaS de gestión inteligente de flotas vehiculares para empresas. Rastreo GPS, mantenimiento predictivo, control de combustible y más.">
    <title>VECTO® — Gestión Inteligente de Flotas</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Barlow+Condensed:wght@600;700;800;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <style>
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
            --black: #000000;
            --navy: #0D2035;
            --navy-light: #142840;
            --yellow: #FFC107;
            --yellow-dark: #E6AC00;
            --white: #FFFFFF;
            --gray-100: #F5F5F5;
            --gray-300: #B0B0B0;
            --gray-500: #6B7280;
            --gray-700: #374151;
            --text: #E8E8E8;
        }

        html { scroll-behavior: smooth; }

        body {
            font-family: 'Inter', sans-serif;
            background-color: var(--black);
            color: var(--text);
            overflow-x: hidden;
            line-height: 1.6;
        }

        h1, h2, h3, h4 { font-family: 'Barlow Condensed', sans-serif; line-height: 1.1; }

        .container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }

        /* ─── NAVBAR ─── */
        #navbar {
            position: fixed;
            top: 0; left: 0; right: 0;
            z-index: 1000;
            padding: 20px 0;
            transition: all 0.3s ease;
        }
        #navbar.scrolled {
            background: rgba(0, 0, 0, 0.92);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border-bottom: 1px solid rgba(255, 193, 7, 0.15);
            padding: 14px 0;
        }
        .nav-inner {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .nav-logo img {
            height: 36px;
            width: auto;
        }
        .nav-logo-text {
            font-family: 'Barlow Condensed', sans-serif;
            font-size: 28px;
            font-weight: 900;
            letter-spacing: 3px;
            color: var(--white);
        }
        .nav-logo-text span { color: var(--yellow); }
        .nav-links {
            display: flex;
            align-items: center;
            gap: 36px;
            list-style: none;
        }
        .nav-links a {
            color: var(--gray-300);
            text-decoration: none;
            font-size: 14px;
            font-weight: 500;
            letter-spacing: 0.5px;
            transition: color 0.2s;
        }
        .nav-links a:hover { color: var(--yellow); }
        .nav-actions { display: flex; align-items: center; gap: 12px; }
        .btn-ghost {
            padding: 9px 20px;
            border: 1px solid rgba(255,255,255,0.2);
            border-radius: 6px;
            color: var(--white);
            text-decoration: none;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.2s;
            white-space: nowrap;
        }
        .btn-ghost:hover { border-color: var(--yellow); color: var(--yellow); }
        .btn-primary {
            padding: 9px 22px;
            background: var(--yellow);
            border-radius: 6px;
            color: var(--black);
            text-decoration: none;
            font-size: 14px;
            font-weight: 700;
            transition: all 0.2s;
            white-space: nowrap;
        }
        .btn-primary:hover { background: var(--yellow-dark); transform: translateY(-1px); }
        .nav-hamburger {
            display: none;
            flex-direction: column;
            gap: 5px;
            cursor: pointer;
            padding: 4px;
        }
        .nav-hamburger span {
            display: block;
            width: 24px;
            height: 2px;
            background: var(--white);
            transition: all 0.3s;
        }
        .nav-mobile {
            display: none;
            flex-direction: column;
            gap: 0;
            background: rgba(0,0,0,0.97);
            border-top: 1px solid rgba(255,193,7,0.1);
            padding: 12px 0;
        }
        .nav-mobile.open { display: flex; }
        .nav-mobile a {
            padding: 14px 24px;
            color: var(--gray-300);
            text-decoration: none;
            font-size: 15px;
            font-weight: 500;
            border-bottom: 1px solid rgba(255,255,255,0.04);
            transition: color 0.2s;
        }
        .nav-mobile a:hover { color: var(--yellow); }
        .nav-mobile .mobile-actions {
            display: flex;
            gap: 10px;
            padding: 16px 24px 8px;
        }
        .nav-mobile .mobile-actions a { padding: 10px 18px; border-bottom: none; }

        /* ─── HERO ─── */
        #hero {
            min-height: 100vh;
            display: flex;
            align-items: center;
            position: relative;
            overflow: hidden;
            background: var(--black);
            padding-top: 80px;
        }
        .hero-bg {
            position: absolute;
            inset: 0;
            background:
                radial-gradient(ellipse 80% 60% at 70% 50%, rgba(13,32,53,0.8) 0%, transparent 70%),
                radial-gradient(ellipse 40% 40% at 20% 80%, rgba(255,193,7,0.06) 0%, transparent 60%);
        }
        .hero-grid-lines {
            position: absolute;
            inset: 0;
            background-image:
                linear-gradient(rgba(255,193,7,0.04) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,193,7,0.04) 1px, transparent 1px);
            background-size: 60px 60px;
        }
        .hero-content {
            display: grid;
            grid-template-columns: 1fr 1fr;
            align-items: center;
            gap: 60px;
            position: relative;
            z-index: 2;
            padding: 60px 0;
        }
        .hero-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: rgba(255,193,7,0.1);
            border: 1px solid rgba(255,193,7,0.3);
            border-radius: 100px;
            padding: 6px 16px;
            font-size: 12px;
            font-weight: 600;
            color: var(--yellow);
            letter-spacing: 1.5px;
            text-transform: uppercase;
            margin-bottom: 24px;
        }
        .hero-badge i { font-size: 10px; }
        .hero-title {
            font-size: clamp(48px, 7vw, 84px);
            font-weight: 900;
            color: var(--white);
            margin-bottom: 24px;
            letter-spacing: -1px;
        }
        .hero-title .accent { color: var(--yellow); }
        .hero-title .line-block { display: block; }
        .hero-subtitle {
            font-size: 17px;
            color: var(--gray-300);
            max-width: 500px;
            margin-bottom: 40px;
            line-height: 1.7;
        }
        .hero-ctas { display: flex; gap: 14px; flex-wrap: wrap; margin-bottom: 52px; }
        .btn-hero-primary {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            padding: 15px 30px;
            background: var(--yellow);
            border-radius: 8px;
            color: var(--black);
            text-decoration: none;
            font-size: 15px;
            font-weight: 700;
            transition: all 0.25s;
        }
        .btn-hero-primary:hover { background: var(--yellow-dark); transform: translateY(-2px); box-shadow: 0 12px 40px rgba(255,193,7,0.3); }
        .btn-hero-secondary {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            padding: 15px 30px;
            border: 1.5px solid rgba(255,255,255,0.2);
            border-radius: 8px;
            color: var(--white);
            text-decoration: none;
            font-size: 15px;
            font-weight: 500;
            transition: all 0.25s;
        }
        .btn-hero-secondary:hover { border-color: var(--yellow); color: var(--yellow); }
        .hero-trust {
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 13px;
            color: var(--gray-500);
        }
        .hero-trust-avatars {
            display: flex;
        }
        .hero-trust-avatars span {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            border: 2px solid var(--black);
            background: var(--navy);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 11px;
            font-weight: 700;
            color: var(--yellow);
            margin-left: -8px;
        }
        .hero-trust-avatars span:first-child { margin-left: 0; }
        .hero-trust strong { color: var(--white); }

        /* Hero Visual */
        .hero-visual {
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
        }
        .map-container {
            width: 100%;
            max-width: 520px;
            aspect-ratio: 1;
            position: relative;
        }
        .map-bg {
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, var(--navy) 0%, #0a1a2e 100%);
            border-radius: 20px;
            border: 1px solid rgba(255,193,7,0.15);
            overflow: hidden;
            position: relative;
        }
        .map-grid {
            position: absolute;
            inset: 0;
            background-image:
                linear-gradient(rgba(255,193,7,0.07) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,193,7,0.07) 1px, transparent 1px);
            background-size: 40px 40px;
        }
        .map-glow {
            position: absolute;
            width: 200px;
            height: 200px;
            background: radial-gradient(circle, rgba(255,193,7,0.12) 0%, transparent 70%);
            border-radius: 50%;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            animation: pulse-glow 3s ease-in-out infinite;
        }
        @keyframes pulse-glow {
            0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
            50% { transform: translate(-50%, -50%) scale(1.3); opacity: 1; }
        }
        .route-path {
            position: absolute;
            inset: 0;
        }
        .route-path svg { width: 100%; height: 100%; }
        .vehicle-dot {
            position: absolute;
            width: 12px;
            height: 12px;
            background: var(--yellow);
            border-radius: 50%;
            border: 2px solid var(--black);
            box-shadow: 0 0 12px var(--yellow);
        }
        .vehicle-dot::after {
            content: '';
            position: absolute;
            inset: -4px;
            border-radius: 50%;
            border: 1px solid rgba(255,193,7,0.4);
            animation: ping 2s ease-in-out infinite;
        }
        @keyframes ping {
            0%, 100% { transform: scale(1); opacity: 0.8; }
            50% { transform: scale(1.8); opacity: 0; }
        }
        .v1 { top: 28%; left: 22%; animation: move1 8s ease-in-out infinite; }
        .v2 { top: 55%; left: 60%; animation: move2 10s ease-in-out infinite; }
        .v3 { top: 70%; left: 30%; animation: move3 12s ease-in-out infinite; }
        @keyframes move1 { 0%,100%{top:28%;left:22%} 50%{top:20%;left:45%} }
        @keyframes move2 { 0%,100%{top:55%;left:60%} 50%{top:40%;left:70%} }
        @keyframes move3 { 0%,100%{top:70%;left:30%} 50%{top:75%;left:55%} }

        .map-card {
            position: absolute;
            background: rgba(0,0,0,0.85);
            border: 1px solid rgba(255,193,7,0.2);
            border-radius: 10px;
            padding: 10px 14px;
            font-size: 12px;
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
        }
        .map-card-label { color: var(--gray-300); font-size: 10px; text-transform: uppercase; letter-spacing: 1px; }
        .map-card-value { color: var(--white); font-weight: 700; font-size: 16px; margin-top: 2px; }
        .map-card-value span { color: var(--yellow); }
        .card-active { top: 12px; right: 12px; }
        .card-speed { bottom: 12px; left: 12px; }
        .card-fuel { bottom: 12px; right: 12px; }

        /* ─── METRICS ─── */
        #metrics {
            background: var(--navy);
            border-top: 1px solid rgba(255,193,7,0.1);
            border-bottom: 1px solid rgba(255,193,7,0.1);
            padding: 60px 0;
        }
        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 1px;
            background: rgba(255,255,255,0.06);
        }
        .metric-item {
            background: var(--navy);
            padding: 40px 32px;
            text-align: center;
            transition: background 0.3s;
        }
        .metric-item:hover { background: var(--navy-light); }
        .metric-number {
            font-family: 'Barlow Condensed', sans-serif;
            font-size: 56px;
            font-weight: 900;
            color: var(--yellow);
            line-height: 1;
            margin-bottom: 8px;
        }
        .metric-label {
            font-size: 14px;
            color: var(--gray-300);
            font-weight: 500;
            letter-spacing: 0.3px;
        }

        /* ─── SECTIONS COMMON ─── */
        section { padding: 100px 0; }
        .section-tag {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 2px;
            text-transform: uppercase;
            color: var(--yellow);
            margin-bottom: 16px;
        }
        .section-tag::before {
            content: '';
            display: block;
            width: 24px;
            height: 2px;
            background: var(--yellow);
        }
        .section-title {
            font-size: clamp(36px, 5vw, 56px);
            font-weight: 900;
            color: var(--white);
            margin-bottom: 16px;
        }
        .section-subtitle {
            font-size: 17px;
            color: var(--gray-300);
            max-width: 580px;
            line-height: 1.7;
        }
        .section-header { margin-bottom: 64px; }
        .section-header.centered { text-align: center; }
        .section-header.centered .section-tag { justify-content: center; }
        .section-header.centered .section-subtitle { margin: 0 auto; }

        /* ─── FEATURES ─── */
        #features { background: var(--black); }
        .features-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 2px;
            background: rgba(255,255,255,0.05);
        }
        .feature-card {
            background: var(--black);
            padding: 40px 32px;
            transition: all 0.3s;
            position: relative;
            overflow: hidden;
        }
        .feature-card::before {
            content: '';
            position: absolute;
            top: 0; left: 0;
            width: 100%; height: 3px;
            background: var(--yellow);
            transform: scaleX(0);
            transition: transform 0.3s;
        }
        .feature-card:hover { background: var(--navy-light); }
        .feature-card:hover::before { transform: scaleX(1); }
        .feature-icon {
            width: 52px;
            height: 52px;
            background: rgba(255,193,7,0.1);
            border: 1px solid rgba(255,193,7,0.2);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 24px;
            font-size: 22px;
            color: var(--yellow);
            transition: all 0.3s;
        }
        .feature-card:hover .feature-icon {
            background: rgba(255,193,7,0.18);
            transform: scale(1.05);
        }
        .feature-title {
            font-family: 'Barlow Condensed', sans-serif;
            font-size: 22px;
            font-weight: 700;
            color: var(--white);
            margin-bottom: 12px;
            letter-spacing: 0.3px;
        }
        .feature-desc { font-size: 14px; color: var(--gray-300); line-height: 1.7; }

        /* ─── HOW IT WORKS ─── */
        #how {
            background: var(--navy);
            position: relative;
            overflow: hidden;
        }
        #how::before {
            content: '';
            position: absolute;
            top: -100px; right: -100px;
            width: 500px; height: 500px;
            background: radial-gradient(circle, rgba(255,193,7,0.05) 0%, transparent 70%);
            border-radius: 50%;
        }
        .steps-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 0;
            position: relative;
        }
        .steps-grid::before {
            content: '';
            position: absolute;
            top: 52px;
            left: calc(16.66% + 26px);
            right: calc(16.66% + 26px);
            height: 2px;
            background: linear-gradient(90deg, var(--yellow) 0%, rgba(255,193,7,0.3) 50%, var(--yellow) 100%);
        }
        .step-item {
            padding: 0 32px;
            text-align: center;
            position: relative;
        }
        .step-number-wrap {
            position: relative;
            display: inline-block;
            margin-bottom: 32px;
        }
        .step-number {
            width: 56px;
            height: 56px;
            background: var(--yellow);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Barlow Condensed', sans-serif;
            font-size: 24px;
            font-weight: 900;
            color: var(--black);
            position: relative;
            z-index: 1;
        }
        .step-icon-wrap {
            width: 72px;
            height: 72px;
            margin: 0 auto 28px;
            background: rgba(255,193,7,0.08);
            border: 2px solid rgba(255,193,7,0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28px;
            color: var(--yellow);
            position: relative;
            z-index: 1;
        }
        .step-title {
            font-family: 'Barlow Condensed', sans-serif;
            font-size: 26px;
            font-weight: 800;
            color: var(--white);
            margin-bottom: 14px;
        }
        .step-desc { font-size: 14px; color: var(--gray-300); line-height: 1.7; max-width: 260px; margin: 0 auto; }
        .step-tag {
            display: inline-block;
            background: rgba(255,193,7,0.1);
            border: 1px solid rgba(255,193,7,0.2);
            border-radius: 100px;
            padding: 3px 14px;
            font-size: 11px;
            font-weight: 700;
            color: var(--yellow);
            letter-spacing: 1px;
            text-transform: uppercase;
            margin-bottom: 20px;
        }

        /* ─── TESTIMONIALS ─── */
        #testimonials { background: var(--black); }
        .testimonials-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 24px;
        }
        .testimonial-card {
            background: var(--navy);
            border: 1px solid rgba(255,255,255,0.06);
            border-radius: 16px;
            padding: 36px;
            transition: all 0.3s;
            position: relative;
        }
        .testimonial-card:hover {
            border-color: rgba(255,193,7,0.2);
            transform: translateY(-4px);
        }
        .testimonial-card::before {
            content: '\201C';
            position: absolute;
            top: 20px; right: 28px;
            font-size: 72px;
            color: rgba(255,193,7,0.1);
            font-family: Georgia, serif;
            line-height: 1;
        }
        .testimonial-stars {
            display: flex;
            gap: 4px;
            margin-bottom: 20px;
        }
        .testimonial-stars i { color: var(--yellow); font-size: 14px; }
        .testimonial-text {
            font-size: 15px;
            color: var(--gray-300);
            line-height: 1.75;
            margin-bottom: 28px;
        }
        .testimonial-author {
            display: flex;
            align-items: center;
            gap: 14px;
        }
        .author-avatar {
            width: 46px;
            height: 46px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--yellow), #ff8c00);
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Barlow Condensed', sans-serif;
            font-size: 18px;
            font-weight: 800;
            color: var(--black);
            flex-shrink: 0;
        }
        .author-name { font-size: 15px; font-weight: 700; color: var(--white); }
        .author-role { font-size: 13px; color: var(--gray-500); margin-top: 2px; }

        /* ─── PRICING ─── */
        #pricing {
            background: var(--navy);
            position: relative;
            overflow: hidden;
        }
        #pricing::after {
            content: '';
            position: absolute;
            bottom: -150px; left: -150px;
            width: 400px; height: 400px;
            background: radial-gradient(circle, rgba(255,193,7,0.04) 0%, transparent 70%);
            border-radius: 50%;
        }
        .pricing-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 2px;
            background: rgba(255,255,255,0.05);
            position: relative;
            z-index: 1;
        }
        .pricing-card {
            background: var(--navy);
            padding: 48px 36px;
            position: relative;
            transition: background 0.3s;
        }
        .pricing-card.featured {
            background: var(--navy-light);
            border-top: 3px solid var(--yellow);
        }
        .pricing-badge {
            position: absolute;
            top: -14px; left: 50%;
            transform: translateX(-50%);
            background: var(--yellow);
            color: var(--black);
            font-size: 11px;
            font-weight: 800;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            padding: 4px 16px;
            border-radius: 100px;
            white-space: nowrap;
        }
        .pricing-plan {
            font-size: 13px;
            font-weight: 700;
            letter-spacing: 2px;
            text-transform: uppercase;
            color: var(--yellow);
            margin-bottom: 12px;
        }
        .pricing-price {
            font-family: 'Barlow Condensed', sans-serif;
            font-size: 56px;
            font-weight: 900;
            color: var(--white);
            line-height: 1;
            margin-bottom: 4px;
        }
        .pricing-price sup {
            font-size: 24px;
            font-weight: 700;
            vertical-align: super;
            line-height: 0;
        }
        .pricing-period {
            font-size: 13px;
            color: var(--gray-500);
            margin-bottom: 28px;
        }
        .pricing-desc {
            font-size: 14px;
            color: var(--gray-300);
            margin-bottom: 32px;
            padding-bottom: 32px;
            border-bottom: 1px solid rgba(255,255,255,0.07);
            line-height: 1.6;
        }
        .pricing-features { list-style: none; margin-bottom: 40px; }
        .pricing-features li {
            display: flex;
            align-items: flex-start;
            gap: 10px;
            font-size: 14px;
            color: var(--gray-300);
            padding: 7px 0;
        }
        .pricing-features li i { color: var(--yellow); font-size: 14px; margin-top: 2px; flex-shrink: 0; }
        .pricing-features li.disabled { opacity: 0.4; }
        .pricing-features li.disabled i { color: var(--gray-500); }
        .btn-pricing {
            display: block;
            width: 100%;
            padding: 14px;
            border-radius: 8px;
            text-align: center;
            font-size: 14px;
            font-weight: 700;
            text-decoration: none;
            transition: all 0.25s;
        }
        .btn-pricing-outline {
            border: 1.5px solid rgba(255,255,255,0.15);
            color: var(--white);
        }
        .btn-pricing-outline:hover { border-color: var(--yellow); color: var(--yellow); }
        .btn-pricing-solid {
            background: var(--yellow);
            color: var(--black);
        }
        .btn-pricing-solid:hover { background: var(--yellow-dark); transform: translateY(-1px); }

        /* ─── CTA / CONTACT ─── */
        #contact {
            background: var(--black);
            position: relative;
            overflow: hidden;
        }
        .contact-wrapper {
            background: linear-gradient(135deg, var(--navy) 0%, #0a1a2e 100%);
            border: 1px solid rgba(255,193,7,0.15);
            border-radius: 24px;
            padding: 72px 60px;
            position: relative;
            overflow: hidden;
        }
        .contact-wrapper::before {
            content: '';
            position: absolute;
            top: -100px; right: -100px;
            width: 400px; height: 400px;
            background: radial-gradient(circle, rgba(255,193,7,0.07) 0%, transparent 70%);
            border-radius: 50%;
        }
        .contact-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 72px;
            align-items: start;
            position: relative;
            z-index: 1;
        }
        .contact-title {
            font-size: clamp(36px, 4vw, 52px);
            font-weight: 900;
            color: var(--white);
            margin-bottom: 16px;
        }
        .contact-title .accent { color: var(--yellow); }
        .contact-text {
            font-size: 15px;
            color: var(--gray-300);
            line-height: 1.7;
            margin-bottom: 36px;
        }
        .contact-perks { list-style: none; display: flex; flex-direction: column; gap: 12px; }
        .contact-perks li {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 14px;
            color: var(--gray-300);
        }
        .contact-perks li i { color: var(--yellow); width: 16px; }
        .contact-form { display: flex; flex-direction: column; gap: 16px; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .form-group { display: flex; flex-direction: column; gap: 6px; }
        .form-label {
            font-size: 12px;
            font-weight: 600;
            letter-spacing: 0.8px;
            text-transform: uppercase;
            color: var(--gray-300);
        }
        .form-input, .form-select {
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 8px;
            padding: 13px 16px;
            color: var(--white);
            font-size: 14px;
            font-family: 'Inter', sans-serif;
            transition: all 0.2s;
            outline: none;
            -webkit-appearance: none;
            appearance: none;
        }
        .form-input::placeholder { color: var(--gray-500); }
        .form-input:focus, .form-select:focus {
            border-color: var(--yellow);
            background: rgba(255,193,7,0.05);
        }
        .form-select { cursor: pointer; }
        .form-select option { background: var(--navy); color: var(--white); }
        .btn-submit {
            width: 100%;
            padding: 16px;
            background: var(--yellow);
            border: none;
            border-radius: 8px;
            color: var(--black);
            font-size: 15px;
            font-weight: 700;
            font-family: 'Inter', sans-serif;
            cursor: pointer;
            transition: all 0.25s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }
        .btn-submit:hover { background: var(--yellow-dark); transform: translateY(-2px); box-shadow: 0 12px 40px rgba(255,193,7,0.25); }
        .form-disclaimer {
            font-size: 12px;
            color: var(--gray-500);
            text-align: center;
            line-height: 1.5;
        }

        /* ─── FOOTER ─── */
        footer {
            background: var(--black);
            border-top: 1px solid rgba(255,255,255,0.07);
            padding: 64px 0 32px;
        }
        .footer-grid {
            display: grid;
            grid-template-columns: 2fr 1fr 1fr 1fr;
            gap: 48px;
            padding-bottom: 48px;
            border-bottom: 1px solid rgba(255,255,255,0.07);
            margin-bottom: 36px;
        }
        .footer-brand-text {
            font-family: 'Barlow Condensed', sans-serif;
            font-size: 30px;
            font-weight: 900;
            color: var(--white);
            letter-spacing: 2px;
            margin-bottom: 16px;
        }
        .footer-brand-text span { color: var(--yellow); }
        .footer-tagline {
            font-size: 14px;
            color: var(--gray-500);
            line-height: 1.7;
            max-width: 280px;
            margin-bottom: 28px;
        }
        .footer-socials {
            display: flex;
            gap: 10px;
        }
        .footer-social {
            width: 38px;
            height: 38px;
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--gray-300);
            text-decoration: none;
            font-size: 15px;
            transition: all 0.2s;
        }
        .footer-social:hover { border-color: var(--yellow); color: var(--yellow); }
        .footer-col-title {
            font-size: 13px;
            font-weight: 700;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            color: var(--white);
            margin-bottom: 20px;
        }
        .footer-links { list-style: none; display: flex; flex-direction: column; gap: 10px; }
        .footer-links a {
            font-size: 14px;
            color: var(--gray-500);
            text-decoration: none;
            transition: color 0.2s;
        }
        .footer-links a:hover { color: var(--yellow); }
        .footer-bottom {
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 12px;
        }
        .footer-copy { font-size: 13px; color: var(--gray-500); }
        .footer-legal {
            display: flex;
            gap: 24px;
        }
        .footer-legal a { font-size: 13px; color: var(--gray-500); text-decoration: none; transition: color 0.2s; }
        .footer-legal a:hover { color: var(--yellow); }

        /* ─── ANIMATIONS ─── */
        .fade-up {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .fade-up.visible {
            opacity: 1;
            transform: translateY(0);
        }
        .fade-up-delay-1 { transition-delay: 0.1s; }
        .fade-up-delay-2 { transition-delay: 0.2s; }
        .fade-up-delay-3 { transition-delay: 0.3s; }
        .fade-up-delay-4 { transition-delay: 0.4s; }

        /* ─── RESPONSIVE ─── */
        @media (max-width: 1024px) {
            .features-grid { grid-template-columns: repeat(2, 1fr); }
            .pricing-grid { grid-template-columns: 1fr; gap: 24px; background: transparent; }
            .pricing-card { border-radius: 16px; border: 1px solid rgba(255,255,255,0.07); }
            .testimonials-grid { grid-template-columns: 1fr 1fr; }
            .footer-grid { grid-template-columns: 1fr 1fr; }
        }

        @media (max-width: 768px) {
            .nav-links, .nav-actions { display: none; }
            .nav-hamburger { display: flex; }
            .hero-content { grid-template-columns: 1fr; gap: 48px; text-align: center; }
            .hero-subtitle { max-width: 100%; }
            .hero-ctas { justify-content: center; }
            .hero-trust { justify-content: center; }
            .hero-visual { order: -1; }
            .map-container { max-width: 360px; }
            .metrics-grid { grid-template-columns: repeat(2, 1fr); }
            .steps-grid { grid-template-columns: 1fr; gap: 48px; }
            .steps-grid::before { display: none; }
            .features-grid { grid-template-columns: 1fr; }
            .testimonials-grid { grid-template-columns: 1fr; }
            .contact-grid { grid-template-columns: 1fr; gap: 40px; }
            .contact-wrapper { padding: 44px 28px; }
            .form-row { grid-template-columns: 1fr; }
            .footer-grid { grid-template-columns: 1fr; gap: 36px; }
            .footer-bottom { flex-direction: column; text-align: center; }
            section { padding: 72px 0; }
        }

        @media (max-width: 480px) {
            .metrics-grid { grid-template-columns: 1fr; }
            .metric-item { padding: 28px 24px; }
            .hero-ctas { flex-direction: column; align-items: center; }
            .btn-hero-primary, .btn-hero-secondary { width: 100%; justify-content: center; }
        }
    </style>
</head>
<body>

<!-- ─── NAVBAR ─── -->
<header>
    <nav id="navbar">
        <div class="container">
            <div class="nav-inner">
                <a href="#" class="nav-logo">
                    @if(file_exists(public_path('images/logos/VECTO-horizontal-duotono.png')))
                        <img src="{{ asset('images/logos/VECTO-horizontal-duotono.png') }}" alt="VECTO">
                    @else
                        <span class="nav-logo-text">VECTO<span>®</span></span>
                    @endif
                </a>
                <ul class="nav-links">
                    <li><a href="#features">Características</a></li>
                    <li><a href="#how">Cómo funciona</a></li>
                    <li><a href="#pricing">Precios</a></li>
                    <li><a href="#contact">Contacto</a></li>
                </ul>
                <div class="nav-actions">
                    <a href="/login" class="btn-ghost">Iniciar sesión</a>
                    <a href="#contact" class="btn-primary">Solicitar demo</a>
                </div>
                <div class="nav-hamburger" id="hamburger" aria-label="Menú">
                    <span></span><span></span><span></span>
                </div>
            </div>
        </div>
        <div class="nav-mobile" id="navMobile">
            <a href="#features">Características</a>
            <a href="#how">Cómo funciona</a>
            <a href="#pricing">Precios</a>
            <a href="#contact">Contacto</a>
            <div class="mobile-actions">
                <a href="/login" class="btn-ghost">Iniciar sesión</a>
                <a href="#contact" class="btn-primary">Solicitar demo</a>
            </div>
        </div>
    </nav>
</header>

<!-- ─── HERO ─── -->
<section id="hero">
    <div class="hero-bg"></div>
    <div class="hero-grid-lines"></div>
    <div class="container">
        <div class="hero-content">
            <div class="hero-text">
                <div class="hero-badge">
                    <i class="fas fa-bolt"></i>
                    Plataforma N°1 en Colombia
                </div>
                <h1 class="hero-title">
                    <span class="line-block">GESTIÓN</span>
                    <span class="line-block"><span class="accent">INTELIGENTE</span></span>
                    <span class="line-block">DE FLOTAS</span>
                </h1>
                <p class="hero-subtitle">
                    Controla, monitorea y optimiza toda tu flota vehicular desde una sola plataforma. Reduce costos, mejora la seguridad y toma decisiones basadas en datos en tiempo real.
                </p>
                <div class="hero-ctas">
                    <a href="#contact" class="btn-hero-primary">
                        <i class="fas fa-rocket"></i>
                        Solicitar demo gratuita
                    </a>
                    <a href="#features" class="btn-hero-secondary">
                        <i class="fas fa-play-circle"></i>
                        Ver características
                    </a>
                </div>
                <div class="hero-trust">
                    <div class="hero-trust-avatars">
                        <span>LP</span><span>MC</span><span>TR</span><span>+</span>
                    </div>
                    <span>Más de <strong>500 empresas</strong> ya confían en VECTO®</span>
                </div>
            </div>
            <div class="hero-visual">
                <div class="map-container">
                    <div class="map-bg">
                        <div class="map-grid"></div>
                        <div class="map-glow"></div>
                        <div class="route-path">
                            <svg viewBox="0 0 520 520" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M80 380 Q 160 300, 240 260 Q 320 220, 390 160" stroke="rgba(255,193,7,0.3)" stroke-width="1.5" stroke-dasharray="6 4" fill="none"/>
                                <path d="M120 440 Q 200 380, 300 340 Q 380 310, 420 260" stroke="rgba(255,193,7,0.2)" stroke-width="1.5" stroke-dasharray="6 4" fill="none"/>
                                <path d="M60 200 Q 140 240, 220 280 Q 280 310, 320 360" stroke="rgba(255,193,7,0.15)" stroke-width="1.5" stroke-dasharray="6 4" fill="none"/>
                                <circle cx="240" cy="260" r="4" fill="rgba(255,193,7,0.5)"/>
                                <circle cx="300" cy="340" r="4" fill="rgba(255,193,7,0.4)"/>
                                <circle cx="390" cy="160" r="4" fill="rgba(255,193,7,0.3)"/>
                            </svg>
                        </div>
                        <div class="vehicle-dot v1"></div>
                        <div class="vehicle-dot v2"></div>
                        <div class="vehicle-dot v3"></div>
                        <div class="map-card card-active">
                            <div class="map-card-label">Vehículos activos</div>
                            <div class="map-card-value"><span>24</span> / 24</div>
                        </div>
                        <div class="map-card card-speed">
                            <div class="map-card-label">Velocidad prom.</div>
                            <div class="map-card-value"><span>67</span> km/h</div>
                        </div>
                        <div class="map-card card-fuel">
                            <div class="map-card-label">Combustible</div>
                            <div class="map-card-value"><span>92%</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- ─── METRICS ─── -->
<section id="metrics">
    <div class="container">
        <div class="metrics-grid">
            <div class="metric-item fade-up">
                <div class="metric-number">500+</div>
                <div class="metric-label">Flotas gestionadas</div>
            </div>
            <div class="metric-item fade-up fade-up-delay-1">
                <div class="metric-number">99.9%</div>
                <div class="metric-label">Uptime garantizado</div>
            </div>
            <div class="metric-item fade-up fade-up-delay-2">
                <div class="metric-number">30%</div>
                <div class="metric-label">Ahorro en costos operativos</div>
            </div>
            <div class="metric-item fade-up fade-up-delay-3">
                <div class="metric-number">15K+</div>
                <div class="metric-label">Vehículos conectados</div>
            </div>
        </div>
    </div>
</section>

<!-- ─── FEATURES ─── -->
<section id="features">
    <div class="container">
        <div class="section-header">
            <div class="section-tag">Características</div>
            <h2 class="section-title">Todo lo que necesitas<br>para tu flota</h2>
            <p class="section-subtitle">Una plataforma completa con todas las herramientas para gestionar, optimizar y escalar tu operación vehicular.</p>
        </div>
        <div class="features-grid">
            <div class="feature-card fade-up">
                <div class="feature-icon"><i class="fas fa-map-marker-alt"></i></div>
                <h3 class="feature-title">Rastreo GPS en Tiempo Real</h3>
                <p class="feature-desc">Visualiza la ubicación exacta de cada vehículo en tiempo real. Geofencing, historial de rutas y alertas de zona en un mapa interactivo.</p>
            </div>
            <div class="feature-card fade-up fade-up-delay-1">
                <div class="feature-icon"><i class="fas fa-tools"></i></div>
                <h3 class="feature-title">Mantenimiento Predictivo</h3>
                <p class="feature-desc">Anticipa fallas antes de que ocurran. Programas de mantenimiento automatizados basados en kilometraje, tiempo y diagnósticos OBD.</p>
            </div>
            <div class="feature-card fade-up fade-up-delay-2">
                <div class="feature-icon"><i class="fas fa-gas-pump"></i></div>
                <h3 class="feature-title">Control de Combustible</h3>
                <p class="feature-desc">Monitoreo preciso del consumo de combustible. Detecta anomalías, sifones y comportamientos de conducción que generan sobrecostos.</p>
            </div>
            <div class="feature-card fade-up">
                <div class="feature-icon"><i class="fas fa-chart-bar"></i></div>
                <h3 class="feature-title">Reportes y Analytics</h3>
                <p class="feature-desc">Dashboards ejecutivos con KPIs en tiempo real. Exporta reportes personalizados en PDF/Excel y toma decisiones con datos confiables.</p>
            </div>
            <div class="feature-card fade-up fade-up-delay-1">
                <div class="feature-icon"><i class="fas fa-id-card"></i></div>
                <h3 class="feature-title">Gestión de Conductores</h3>
                <p class="feature-desc">Perfiles de conductor, scoring de comportamiento, control de licencias y documentos. Asigna rutas y monitorea el cumplimiento normativo.</p>
            </div>
            <div class="feature-card fade-up fade-up-delay-2">
                <div class="feature-icon"><i class="fas fa-bell"></i></div>
                <h3 class="feature-title">Alertas Inteligentes</h3>
                <p class="feature-desc">Notificaciones en tiempo real por SMS, email y app ante eventos críticos: exceso de velocidad, salida de zona, fallo mecánico y más.</p>
            </div>
        </div>
    </div>
</section>

<!-- ─── HOW IT WORKS ─── -->
<section id="how">
    <div class="container">
        <div class="section-header centered">
            <div class="section-tag">Proceso</div>
            <h2 class="section-title">Cómo funciona VECTO®</h2>
            <p class="section-subtitle">En tres simples pasos, tu flota estará completamente conectada, monitorizada y optimizada.</p>
        </div>
        <div class="steps-grid">
            <div class="step-item fade-up">
                <div class="step-icon-wrap">
                    <i class="fas fa-plug"></i>
                </div>
                <div class="step-tag">Paso 01</div>
                <h3 class="step-title">Conecta tu flota</h3>
                <p class="step-desc">Instala nuestros dispositivos GPS/OBD en tus vehículos en minutos. Sin obras, sin complicaciones. Compatible con cualquier tipo de vehículo comercial.</p>
            </div>
            <div class="step-item fade-up fade-up-delay-1">
                <div class="step-icon-wrap">
                    <i class="fas fa-satellite-dish"></i>
                </div>
                <div class="step-tag">Paso 02</div>
                <h3 class="step-title">Monitorea en tiempo real</h3>
                <p class="step-desc">Accede desde cualquier dispositivo a tu dashboard centralizado. Visualiza rutas, alertas, estado mecánico y rendimiento de cada conductor al instante.</p>
            </div>
            <div class="step-item fade-up fade-up-delay-2">
                <div class="step-icon-wrap">
                    <i class="fas fa-chart-line"></i>
                </div>
                <div class="step-tag">Paso 03</div>
                <h3 class="step-title">Optimiza y ahorra</h3>
                <p class="step-desc">Usa la IA de VECTO® para identificar ineficiencias, optimizar rutas y reducir costos operativos hasta un 30% en los primeros 3 meses.</p>
            </div>
        </div>
    </div>
</section>

<!-- ─── TESTIMONIALS ─── -->
<section id="testimonials">
    <div class="container">
        <div class="section-header centered">
            <div class="section-tag">Testimonios</div>
            <h2 class="section-title">Lo que dicen nuestros clientes</h2>
            <p class="section-subtitle">Empresas de toda Colombia ya transformaron su operación logística con VECTO®.</p>
        </div>
        <div class="testimonials-grid">
            <div class="testimonial-card fade-up">
                <div class="testimonial-stars">
                    <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
                </div>
                <p class="testimonial-text">"Desde que implementamos VECTO® reducimos el consumo de combustible un 28% en los primeros dos meses. El control en tiempo real nos permitió eliminar rutas ineficientes que no teníamos identificadas. Es una herramienta indispensable para nuestra operación."</p>
                <div class="testimonial-author">
                    <div class="author-avatar">LP</div>
                    <div>
                        <div class="author-name">Luis Pedraza</div>
                        <div class="author-role">Gerente de Operaciones — Logística del Pacífico S.A.S</div>
                    </div>
                </div>
            </div>
            <div class="testimonial-card fade-up fade-up-delay-1">
                <div class="testimonial-stars">
                    <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
                </div>
                <p class="testimonial-text">"El mantenimiento predictivo nos salvó de paradas imprevistas que nos costaban millones. Ahora programamos los servicios con anticipación y nuestros vehículos tienen el 99% de disponibilidad operativa. El ROI fue evidente desde el primer mes."</p>
                <div class="testimonial-author">
                    <div class="author-avatar" style="background: linear-gradient(135deg, #4CAF50, #2E7D32);">MC</div>
                    <div>
                        <div class="author-name">María Castellanos</div>
                        <div class="author-role">Directora de Flota — Transportes Meridiano</div>
                    </div>
                </div>
            </div>
            <div class="testimonial-card fade-up fade-up-delay-2">
                <div class="testimonial-stars">
                    <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
                </div>
                <p class="testimonial-text">"Manejamos 80 camiones en 6 departamentos y antes era un caos. Con VECTO® tenemos visibilidad total desde un solo dashboard. Las alertas inteligentes nos avisaron de un intento de sifón antes de que pasara. Vale cada peso que invertimos."</p>
                <div class="testimonial-author">
                    <div class="author-avatar" style="background: linear-gradient(135deg, #2196F3, #0D47A1);">TR</div>
                    <div>
                        <div class="author-name">Tomás Rondón</div>
                        <div class="author-role">CEO — Distribuciones TRK Colombia</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- ─── PRICING ─── -->
<section id="pricing">
    <div class="container">
        <div class="section-header centered">
            <div class="section-tag">Precios</div>
            <h2 class="section-title">Planes para cada tamaño de flota</h2>
            <p class="section-subtitle">Sin contratos de largo plazo. Sin costos ocultos. Cancela cuando quieras.</p>
        </div>
        <div class="pricing-grid">
            <div class="pricing-card fade-up">
                <div class="pricing-plan">Básico</div>
                <div class="pricing-price"><sup>$</sup>299.000</div>
                <div class="pricing-period">COP / mes · hasta 10 vehículos</div>
                <div class="pricing-desc">Ideal para pequeñas empresas que están comenzando a gestionar su flota de forma profesional.</div>
                <ul class="pricing-features">
                    <li><i class="fas fa-check"></i> Rastreo GPS en tiempo real</li>
                    <li><i class="fas fa-check"></i> Historial de rutas (30 días)</li>
                    <li><i class="fas fa-check"></i> Alertas de velocidad</li>
                    <li><i class="fas fa-check"></i> Reportes básicos mensuales</li>
                    <li><i class="fas fa-check"></i> App móvil incluida</li>
                    <li class="disabled"><i class="fas fa-times"></i> Mantenimiento predictivo</li>
                    <li class="disabled"><i class="fas fa-times"></i> Control de combustible avanzado</li>
                    <li class="disabled"><i class="fas fa-times"></i> Analytics avanzados</li>
                </ul>
                <a href="#contact" class="btn-pricing btn-pricing-outline">Empezar gratis</a>
            </div>
            <div class="pricing-card featured fade-up fade-up-delay-1">
                <div class="pricing-badge">Más popular</div>
                <div class="pricing-plan">Profesional</div>
                <div class="pricing-price"><sup>$</sup>749.000</div>
                <div class="pricing-period">COP / mes · hasta 50 vehículos</div>
                <div class="pricing-desc">La solución completa para empresas en crecimiento que necesitan control total sobre su operación.</div>
                <ul class="pricing-features">
                    <li><i class="fas fa-check"></i> Todo lo del plan Básico</li>
                    <li><i class="fas fa-check"></i> Mantenimiento predictivo con IA</li>
                    <li><i class="fas fa-check"></i> Control de combustible avanzado</li>
                    <li><i class="fas fa-check"></i> Analytics y reportes ilimitados</li>
                    <li><i class="fas fa-check"></i> Gestión de conductores completa</li>
                    <li><i class="fas fa-check"></i> Geofencing y zonas personalizadas</li>
                    <li><i class="fas fa-check"></i> Integración con ERP/TMS</li>
                    <li><i class="fas fa-check"></i> Soporte prioritario 24/7</li>
                </ul>
                <a href="#contact" class="btn-pricing btn-pricing-solid">Solicitar demo</a>
            </div>
            <div class="pricing-card fade-up fade-up-delay-2">
                <div class="pricing-plan">Enterprise</div>
                <div class="pricing-price">A la medida</div>
                <div class="pricing-period">Flota ilimitada · Contrato anual</div>
                <div class="pricing-desc">Para grandes operaciones que requieren personalización, SLAs garantizados y acompañamiento dedicado.</div>
                <ul class="pricing-features">
                    <li><i class="fas fa-check"></i> Todo lo del plan Profesional</li>
                    <li><i class="fas fa-check"></i> Vehículos ilimitados</li>
                    <li><i class="fas fa-check"></i> Instancia dedicada en la nube</li>
                    <li><i class="fas fa-check"></i> API completa + webhooks</li>
                    <li><i class="fas fa-check"></i> White-label disponible</li>
                    <li><i class="fas fa-check"></i> Gerente de cuenta dedicado</li>
                    <li><i class="fas fa-check"></i> SLA 99.9% garantizado</li>
                    <li><i class="fas fa-check"></i> Onboarding presencial</li>
                </ul>
                <a href="#contact" class="btn-pricing btn-pricing-outline">Hablar con ventas</a>
            </div>
        </div>
    </div>
</section>

<!-- ─── CONTACT / CTA FINAL ─── -->
<section id="contact">
    <div class="container">
        <div class="contact-wrapper">
            <div class="contact-grid">
                <div>
                    <div class="section-tag">Empieza hoy</div>
                    <h2 class="contact-title">Tu flota, bajo <span class="accent">control total</span></h2>
                    <p class="contact-text">Solicita una demo personalizada y un consultor de VECTO® te mostrará cómo transformar tu operación logística en menos de 30 minutos.</p>
                    <ul class="contact-perks">
                        <li><i class="fas fa-check-circle"></i> Demo gratuita y sin compromiso</li>
                        <li><i class="fas fa-check-circle"></i> Configuración en menos de 24 horas</li>
                        <li><i class="fas fa-check-circle"></i> Sin tarjeta de crédito requerida</li>
                        <li><i class="fas fa-check-circle"></i> Acompañamiento técnico incluido</li>
                        <li><i class="fas fa-check-circle"></i> Datos seguros y encriptados</li>
                    </ul>
                </div>
                <div>
                    <form class="contact-form" id="contactForm">
                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label" for="nombre">Nombre</label>
                                <input type="text" id="nombre" name="nombre" class="form-input" placeholder="Tu nombre completo" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label" for="empresa">Empresa</label>
                                <input type="text" id="empresa" name="empresa" class="form-input" placeholder="Nombre de tu empresa" required>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label" for="email">Correo electrónico</label>
                                <input type="email" id="email" name="email" class="form-input" placeholder="tu@empresa.com" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label" for="telefono">Teléfono</label>
                                <input type="tel" id="telefono" name="telefono" class="form-input" placeholder="+57 300 000 0000">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="vehiculos">¿Cuántos vehículos tiene tu flota?</label>
                            <select id="vehiculos" name="vehiculos" class="form-select form-input">
                                <option value="" disabled selected>Selecciona un rango</option>
                                <option value="1-10">1 – 10 vehículos</option>
                                <option value="11-50">11 – 50 vehículos</option>
                                <option value="51-100">51 – 100 vehículos</option>
                                <option value="101-500">101 – 500 vehículos</option>
                                <option value="500+">Más de 500 vehículos</option>
                            </select>
                        </div>
                        <button type="submit" class="btn-submit">
                            <i class="fas fa-paper-plane"></i>
                            Solicitar demo gratuita
                        </button>
                        <p class="form-disclaimer">Al enviar aceptas nuestra <a href="#" style="color:var(--yellow)">política de privacidad</a>. Sin spam, prometido.</p>
                    </form>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- ─── FOOTER ─── -->
<footer>
    <div class="container">
        <div class="footer-grid">
            <div>
                <div class="footer-brand-text">VECTO<span>®</span></div>
                <p class="footer-tagline">La plataforma SaaS líder en gestión inteligente de flotas vehiculares para empresas en Latinoamérica.</p>
                <div class="footer-socials">
                    <a href="#" class="footer-social" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
                    <a href="#" class="footer-social" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
                    <a href="#" class="footer-social" aria-label="Twitter/X"><i class="fab fa-x-twitter"></i></a>
                    <a href="#" class="footer-social" aria-label="YouTube"><i class="fab fa-youtube"></i></a>
                </div>
            </div>
            <div>
                <div class="footer-col-title">Producto</div>
                <ul class="footer-links">
                    <li><a href="#features">Características</a></li>
                    <li><a href="#how">Cómo funciona</a></li>
                    <li><a href="#pricing">Precios</a></li>
                    <li><a href="#">Integraciones</a></li>
                    <li><a href="#">API</a></li>
                </ul>
            </div>
            <div>
                <div class="footer-col-title">Empresa</div>
                <ul class="footer-links">
                    <li><a href="#">Nosotros</a></li>
                    <li><a href="#">Blog</a></li>
                    <li><a href="#">Casos de éxito</a></li>
                    <li><a href="#">Partners</a></li>
                    <li><a href="#contact">Contacto</a></li>
                </ul>
            </div>
            <div>
                <div class="footer-col-title">Soporte</div>
                <ul class="footer-links">
                    <li><a href="#">Centro de ayuda</a></li>
                    <li><a href="#">Documentación</a></li>
                    <li><a href="#">Status del sistema</a></li>
                    <li><a href="#">Comunidad</a></li>
                    <li><a href="#">Seguridad</a></li>
                </ul>
            </div>
        </div>
        <div class="footer-bottom">
            <span class="footer-copy">© 2026 VECTO® — Todos los derechos reservados. Hecho en Colombia 🇨🇴</span>
            <div class="footer-legal">
                <a href="#">Términos de uso</a>
                <a href="#">Política de privacidad</a>
                <a href="#">Cookies</a>
            </div>
        </div>
    </div>
</footer>

<script>
    // Navbar scroll
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });

    // Mobile menu
    const hamburger = document.getElementById('hamburger');
    const navMobile = document.getElementById('navMobile');
    hamburger.addEventListener('click', () => {
        navMobile.classList.toggle('open');
    });
    navMobile.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => navMobile.classList.remove('open'));
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const offset = 80;
                window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
            }
        });
    });

    // Intersection Observer for fade-up animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

    // Contact form
    document.getElementById('contactForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const btn = this.querySelector('.btn-submit');
        const original = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> ¡Solicitud enviada!';
        btn.style.background = '#22c55e';
        btn.disabled = true;
        setTimeout(() => {
            btn.innerHTML = original;
            btn.style.background = '';
            btn.disabled = false;
            this.reset();
        }, 3500);
    });

    // Animated counters for metrics
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters(entry.target.querySelectorAll('.metric-number'));
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const metricsSection = document.getElementById('metrics');
    if (metricsSection) counterObserver.observe(metricsSection);

    function animateCounters(elements) {
        elements.forEach(el => {
            const text = el.textContent;
            const num = parseFloat(text.replace(/[^0-9.]/g, ''));
            const suffix = text.replace(/[0-9.]/g, '');
            if (isNaN(num)) return;
            let start = 0;
            const duration = 1800;
            const step = (timestamp) => {
                if (!start) start = timestamp;
                const progress = Math.min((timestamp - start) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                el.textContent = (num < 100 ? (eased * num).toFixed(num % 1 !== 0 ? 1 : 0) : Math.round(eased * num)) + suffix;
                if (progress < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
        });
    }
</script>
</body>
</html>

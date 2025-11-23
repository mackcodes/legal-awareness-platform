// Indian Legal Acts - Complete Data
// Source: Official Government of India Legal Database

export interface Section {
  number: string;
  title: string;
  description: string;
  content?: string;
}

export interface Fine {
  violation: string;
  section: string;
  penalty: string;
  imprisonment?: string;
}

export interface Act {
  id: string;
  name: string;
  year: string;
  category: string;
  description: string;
  fullName: string;
  enactedDate?: string;
  lastAmended?: string;
  objectives: string[];
  sections: Section[];
  fines?: Fine[];
}

export const INDIAN_ACTS: Act[] = [
  {
    id: "rti-act",
    name: "Right to Information Act",
    fullName: "The Right to Information Act, 2005",
    year: "2005",
    category: "Governance",
    description: "Empowers citizens to access government information and promotes transparency and accountability",
    enactedDate: "15 June 2005",
    lastAmended: "2019",
    objectives: [
      "To provide for setting out the practical regime of right to information for citizens",
      "To promote transparency and accountability in the working of every public authority",
      "To empower the citizens and promote democracy",
      "To contain corruption and make government accountable to the governed"
    ],
    sections: [
      {
        number: "1",
        title: "Short title, extent and commencement",
        description: "Name and applicability of the Act",
        content: "This Act may be called the Right to Information Act, 2005. It extends to the whole of India except the State of Jammu and Kashmir."
      },
      {
        number: "2",
        title: "Definitions",
        description: "Key terms defined in the Act",
        content: "In this Act, unless the context otherwise requires: 'appropriate Government' means in relation to a public authority which is established, constituted, owned, controlled or substantially financed by the Central Government or the Union territory administration, the Central Government; 'information' means any material in any form, including records, documents, memos, e-mails, opinions, advices, press releases, circulars, orders, logbooks, contracts, reports, papers, samples, models, data material held in any electronic form."
      },
      {
        number: "3",
        title: "Right to information",
        description: "Citizens' right to seek information",
        content: "All citizens shall have the right to information subject to the provisions of this Act. All authorities shall be bound to provide information to any citizen who requests information."
      },
      {
        number: "4",
        title: "Obligations of public authorities",
        description: "Duties of government bodies",
        content: "Every public authority shall: (a) maintain all its records duly catalogued and indexed; (b) publish various information including particulars of its organisation, functions and duties; (c) publish the manner of execution of subsidy programmes; (d) publish details of recipients of concessions, permits or authorisations granted."
      },
      {
        number: "5",
        title: "Designation of Public Information Officers",
        description: "Appointment of officers to handle RTI requests",
        content: "Every public authority shall designate as many officers as Public Information Officers (PIOs) in all administrative units or offices under it as may be necessary to provide information to persons requesting for the information."
      },
      {
        number: "6",
        title: "Request for obtaining information",
        description: "Procedure for requesting information",
        content: "A person, who desires to obtain any information under this Act, shall make a request in writing or through electronic means in English or Hindi or in the official language of the area, to the Public Information Officer, specifying the particulars of the information sought by him."
      },
      {
        number: "7",
        title: "Disposal of request",
        description: "Timeline for providing information",
        content: "The Public Information Officer shall provide the information within thirty days from the date of receipt of the request. If the information concerns the life or liberty of a person, it shall be provided within forty-eight hours."
      },
      {
        number: "8",
        title: "Exemption from disclosure of information",
        description: "Information that cannot be disclosed",
        content: "Notwithstanding anything contained in this Act, there shall be no obligation to give any citizen: (a) information which prejudicially affects the sovereignty and integrity of India; (b) information expressly forbidden by any court; (c) information which would cause breach of privilege of Parliament or State Legislature; (d) commercial confidence, trade secrets or intellectual property."
      },
      {
        number: "18",
        title: "Power to make rules",
        description: "Government's rule-making authority",
        content: "The appropriate Government may make rules to carry out the provisions of this Act including fees for obtaining information, periods within which information is to be furnished, and the form and manner of making a request."
      },
      {
        number: "19",
        title: "Constitution of Central Information Commission",
        description: "Establishment of appellate body",
        content: "The Central Government shall constitute a body to be known as the Central Information Commission to exercise the powers conferred on, and to perform the functions assigned to, it under this Act."
      }
    ]
  },
  {
    id: "consumer-act",
    name: "Consumer Protection Act",
    fullName: "The Consumer Protection Act, 2019",
    year: "2019",
    category: "Consumer Rights",
    description: "Protects consumer rights, provides remedies for unfair trade practices, and establishes consumer dispute redressal mechanism",
    enactedDate: "9 August 2019",
    lastAmended: "2021",
    objectives: [
      "To protect the rights of consumers",
      "To establish authorities for timely and effective administration and settlement of consumers' disputes",
      "To provide better protection of the interests of consumers",
      "To prevent unfair trade practices and false advertisements"
    ],
    sections: [
      {
        number: "2",
        title: "Definitions",
        description: "Key terms including consumer, defect, and service",
        content: "'Consumer' means any person who buys any goods for a consideration and includes any user of such goods; 'Defect' means any fault, imperfection or shortcoming in the quality, quantity, potency, purity or standard; 'Service' means service of any description which is made available to potential users."
      },
      {
        number: "2(7)",
        title: "Consumer Rights",
        description: "Six fundamental consumer rights",
        content: "Consumer rights include: (a) the right to be protected against marketing of goods and services which are hazardous to life and property; (b) the right to be informed about the quality, quantity, potency, purity, standard and price of goods or services; (c) the right to be assured access to a variety of goods and services at competitive prices; (d) the right to be heard; (e) the right to seek redressal; (f) the right to consumer education."
      },
      {
        number: "12",
        title: "Prohibition against unfair trade practice",
        description: "Bans misleading and deceptive practices",
        content: "No person shall engage in unfair trade practice. Unfair trade practice means a trade practice which, for the purpose of promoting the sale, use or supply of any goods or services, adopts any unfair method or deceptive practice."
      },
      {
        number: "21",
        title: "Misleading advertisement",
        description: "Prohibition of false or misleading advertisements",
        content: "No person shall make or publish or cause to be published any advertisement which is false or misleading or one which deliberately conceals important information."
      },
      {
        number: "34",
        title: "Product liability",
        description: "Manufacturer's liability for defective products",
        content: "A product manufacturer, service provider or product seller shall be liable to compensate for harm caused to any consumer by such defective product manufactured or sold or by deficiency in services."
      },
      {
        number: "35",
        title: "Jurisdiction of District Commission",
        description: "Consumer cases at district level",
        content: "The District Commission shall have jurisdiction to entertain complaints where the value of the goods or services and compensation claimed does not exceed rupees one crore."
      },
      {
        number: "47",
        title: "Jurisdiction of State Commission",
        description: "Consumer cases at state level",
        content: "The State Commission shall have jurisdiction to entertain complaints where the value of the goods or services and compensation claimed exceeds rupees one crore but does not exceed rupees ten crores."
      },
      {
        number: "58",
        title: "Jurisdiction of National Commission",
        description: "Consumer cases at national level",
        content: "The National Commission shall have jurisdiction to entertain complaints where the value of the goods or services and compensation claimed exceeds rupees ten crores."
      },
      {
        number: "84",
        title: "Penalty for false or misleading advertisement",
        description: "Punishment for false advertising",
        content: "Whoever manufactures or causes to be manufactured, or endorses a false or misleading advertisement shall be punished with imprisonment for a term which may extend to two years and with fine which may extend to ten lakh rupees."
      },
      {
        number: "89",
        title: "Penalty for non-compliance of the order of Commission",
        description: "Consequences of not following Commission's orders",
        content: "Whoever fails to comply with any order made by the District Commission, the State Commission or the National Commission shall be punishable with imprisonment for a term which shall not be less than one month but which may extend to three years, or with fine which shall not be less than twenty-five thousand rupees but which may extend to one lakh rupees, or with both."
      }
    ]
  },
  {
    id: "motor-act",
    name: "Motor Vehicles Act",
    fullName: "The Motor Vehicles Act, 1988",
    year: "1988",
    category: "Transport",
    description: "Regulates road transport, traffic rules, vehicle registration, licensing, and road safety",
    enactedDate: "1 July 1989",
    lastAmended: "2019 (Motor Vehicles Amendment Act)",
    objectives: [
      "To consolidate and amend the law relating to motor vehicles",
      "To provide for road safety and traffic management",
      "To regulate vehicle registration and licensing",
      "To establish penalties for traffic violations"
    ],
    sections: [
      {
        number: "3",
        title: "Necessity for driving licence",
        description: "Requirement of valid driving licence",
        content: "No person shall drive a motor vehicle in any public place unless he holds an effective driving licence issued to him authorising him to drive the vehicle."
      },
      {
        number: "5",
        title: "Age limit for driving motor vehicles",
        description: "Minimum age requirements for different vehicle types",
        content: "No person under the age of eighteen years shall drive a motor vehicle in any public place. No person under the age of twenty years shall drive a transport vehicle in any public place."
      },
      {
        number: "39",
        title: "Necessity for registration",
        description: "Vehicle registration requirements",
        content: "No person shall drive any motor vehicle and no owner of a motor vehicle shall cause or permit the vehicle to be driven in any public place unless the vehicle is registered."
      },
      {
        number: "129",
        title: "Wearing of protective headgear",
        description: "Helmet mandatory for two-wheeler riders",
        content: "Every person driving or riding on a motorcycle shall, while in a public place, wear protective headgear conforming to such standards as may be prescribed."
      },
      {
        number: "130",
        title: "Duty to wear seat-belt",
        description: "Seat belt mandatory for car occupants",
        content: "The driver and person seated in the front seat of a motor vehicle shall wear seat-belts while the vehicle is in motion."
      },
      {
        number: "132",
        title: "Duty to obey traffic signs",
        description: "Compliance with traffic signals and signs",
        content: "The driver of a motor vehicle in a public place shall observe and comply with all traffic signs displayed."
      },
      {
        number: "134",
        title: "Limits of speed",
        description: "Speed restrictions for different vehicles",
        content: "No person shall drive a motor vehicle in any public place at a speed exceeding the maximum speed or at a speed less than the minimum speed fixed for the vehicle under this Act."
      },
      {
        number: "138",
        title: "Dangerous driving",
        description: "Prohibition of rash and negligent driving",
        content: "Whoever drives a motor vehicle at a speed or in a manner which is dangerous to the public, having regard to all the circumstances, shall be punishable for the first offence with imprisonment for a term which may extend to six months, or with fine which may extend to one thousand rupees, or with both."
      },
      {
        number: "146",
        title: "Necessity for insurance against third party risk",
        description: "Mandatory vehicle insurance",
        content: "No person shall use, except as a passenger, or cause or allow any other person to use, a motor vehicle in a public place, unless there is in force in relation to the use of the vehicle by that person a policy of insurance complying with the requirements of this Chapter."
      },
      {
        number: "177",
        title: "Offences relating to licences",
        description: "Penalties for driving without licence",
        content: "Whoever drives a motor vehicle in contravention of section 3 shall be punishable for the first offence with a fine of five thousand rupees, and for any second or subsequent offence with a fine of ten thousand rupees."
      },
      {
        number: "181",
        title: "Driving vehicles in contravention of section 56",
        description: "Penalties for unregistered vehicles",
        content: "Whoever drives a motor vehicle or causes or allows a motor vehicle to be used in contravention of the provisions of section 39 shall be punishable with a fine of ten thousand rupees."
      },
      {
        number: "183",
        title: "Driving at excessive speed",
        description: "Penalties for overspeeding",
        content: "Whoever drives a motor vehicle in excess of the speed limit shall be liable to pay a penalty which may extend to one thousand rupees for light motor vehicles and two thousand rupees for medium or heavy motor vehicles."
      },
      {
        number: "184",
        title: "Driving dangerously",
        description: "Enhanced penalties for dangerous driving",
        content: "Whoever drives a motor vehicle at a speed or in a manner which is dangerous to the public shall be punishable with imprisonment for a term which may extend to six months or with fine which may extend to one thousand rupees or with both for first offence; and with imprisonment which may extend to two years or with fine which may extend to two thousand rupees or with both for second or subsequent offence."
      },
      {
        number: "185",
        title: "Driving by a drunken person or by a person under the influence of drugs",
        description: "Prohibition and penalties for drunk driving",
        content: "Whoever drives or attempts to drive a motor vehicle having consumed alcohol exceeding 30 mg per 100 ml of blood shall be punishable with imprisonment for a term which may extend to six months, or with fine which may extend to ten thousand rupees, or with both."
      },
      {
        number: "194",
        title: "Driving without insurance",
        description: "Penalties for driving uninsured vehicle",
        content: "Whoever drives a motor vehicle without a valid insurance policy shall be punishable with imprisonment which may extend to three months, or with fine of two thousand rupees, or with both."
      }
    ],
    fines: [
      {
        violation: "Driving without licence",
        section: "Section 3, 177",
        penalty: "₹5,000 (first offence), ₹10,000 (subsequent offences)",
        imprisonment: "Not applicable"
      },
      {
        violation: "Driving without registration",
        section: "Section 39, 181",
        penalty: "₹10,000",
        imprisonment: "Not applicable"
      },
      {
        violation: "Driving without insurance",
        section: "Section 146, 194",
        penalty: "₹2,000",
        imprisonment: "Up to 3 months or both"
      },
      {
        violation: "Overspeeding",
        section: "Section 183",
        penalty: "₹1,000 (light vehicles), ₹2,000 (medium/heavy vehicles)",
        imprisonment: "Not applicable"
      },
      {
        violation: "Dangerous/Rash driving",
        section: "Section 184",
        penalty: "₹1,000 to ₹5,000",
        imprisonment: "Up to 6 months (first), up to 2 years (subsequent)"
      },
      {
        violation: "Drunk driving",
        section: "Section 185",
        penalty: "₹10,000",
        imprisonment: "Up to 6 months or both"
      },
      {
        violation: "Not wearing helmet (two-wheeler)",
        section: "Section 129, 177",
        penalty: "₹1,000 + Disqualification of licence for 3 months",
        imprisonment: "Not applicable"
      },
      {
        violation: "Not wearing seat belt",
        section: "Section 130, 177",
        penalty: "₹1,000",
        imprisonment: "Not applicable"
      },
      {
        violation: "Jumping red light/Disobeying traffic signals",
        section: "Section 132, 177",
        penalty: "₹1,000 to ₹5,000",
        imprisonment: "Not applicable"
      },
      {
        violation: "Using mobile phone while driving",
        section: "Section 177",
        penalty: "₹1,000 (first), ₹10,000 (subsequent)",
        imprisonment: "Not applicable"
      },
      {
        violation: "Overloading (goods vehicle)",
        section: "Section 194",
        penalty: "₹20,000 + ₹2,000 per extra tonne",
        imprisonment: "Not applicable"
      },
      {
        violation: "Overloading (passenger vehicle)",
        section: "Section 194A",
        penalty: "₹1,000 per extra passenger",
        imprisonment: "Not applicable"
      },
      {
        violation: "Racing and driving at high speed",
        section: "Section 189",
        penalty: "₹5,000",
        imprisonment: "Up to 1 month or both"
      },
      {
        violation: "Driving under-age",
        section: "Section 5, 181",
        penalty: "₹5,000 + Guardian liable for ₹25,000",
        imprisonment: "Up to 3 years for guardian"
      },
      {
        violation: "Driving without permit (commercial)",
        section: "Section 192A",
        penalty: "₹10,000 (first), ₹10,000 + vehicle seizure (subsequent)",
        imprisonment: "Not applicable"
      },
      {
        violation: "Violation of road regulations",
        section: "Section 177",
        penalty: "₹500 (general traffic violations)",
        imprisonment: "Not applicable"
      },
      {
        violation: "Causing obstruction to free flow of traffic",
        section: "Section 122",
        penalty: "₹500 to ₹1,000",
        imprisonment: "Not applicable"
      },
      {
        violation: "Not giving way to emergency vehicles",
        section: "Section 194E",
        penalty: "₹10,000",
        imprisonment: "Not applicable"
      },
      {
        violation: "Driving with defective brakes/lights",
        section: "Section 190",
        penalty: "₹500 to ₹1,500",
        imprisonment: "Not applicable"
      },
      {
        violation: "Carrying goods on roof",
        section: "Section 177",
        penalty: "₹1,000",
        imprisonment: "Not applicable"
      }
    ]
  },
  {
    id: "ipc",
    name: "Indian Penal Code",
    fullName: "The Indian Penal Code, 1860",
    year: "1860",
    category: "Criminal Law",
    description: "Defines crimes and prescribes punishments for various offences in India",
    enactedDate: "6 October 1860",
    lastAmended: "2023 (Bharatiya Nyaya Sanhita replaces IPC from 2024)",
    objectives: [
      "To provide a general penal code for India",
      "To define various criminal offences",
      "To prescribe punishments for crimes",
      "To ensure uniformity in criminal law across India"
    ],
    sections: [
      {
        number: "34",
        title: "Common intention",
        description: "Acts done by several persons in furtherance of common intention",
        content: "When a criminal act is done by several persons in furtherance of the common intention of all, each of such persons is liable for that act in the same manner as if it were done by him alone."
      },
      {
        number: "53",
        title: "Punishments",
        description: "Types of punishments under IPC",
        content: "The punishments to which offenders are liable under the provisions of this Code are: Death, Imprisonment for life, Imprisonment (rigorous or simple), Forfeiture of property, and Fine."
      },
      {
        number: "76",
        title: "Act done by a person bound by law",
        description: "No crime if act done under legal obligation",
        content: "Nothing is an offence which is done by a person who is bound by law to do it."
      },
      {
        number: "79",
        title: "Act done by a person justified by law",
        description: "Justifiable acts not crimes",
        content: "Nothing is an offence which is done by any person who is justified by law in doing it."
      },
      {
        number: "80",
        title: "Accident in doing a lawful act",
        description: "No crime if act done accidentally",
        content: "Nothing is an offence which is done by accident or misfortune, and without any criminal intention or knowledge in the doing of a lawful act in a lawful manner by lawful means and with proper care and caution."
      },
      {
        number: "96",
        title: "Right of private defence",
        description: "Right to defend oneself and property",
        content: "Nothing is an offence which is done in the exercise of the right of private defence."
      },
      {
        number: "100",
        title: "Right of private defence of body extending to causing death",
        description: "When self-defence can extend to causing death",
        content: "The right of private defence of the body extends to the voluntary causing of death if the offence occasions reasonable apprehension of death, grievous hurt, rape, or kidnapping."
      },
      {
        number: "121",
        title: "Waging war against Government of India",
        description: "Punishment for waging war against the nation",
        content: "Whoever wages war against the Government of India, or attempts to wage such war, or abets the waging of such war, shall be punished with death, or imprisonment for life and shall also be liable to fine."
      },
      {
        number: "124A",
        title: "Sedition",
        description: "Bringing hatred or contempt towards Government (under review)",
        content: "Whoever by words, either spoken or written, or by signs, or by visible representation, or otherwise, brings or attempts to bring into hatred or contempt, or excites or attempts to excite disaffection towards the Government established by law shall be punished with imprisonment for life, to which fine may be added, or with imprisonment which may extend to three years, to which fine may be added, or with fine."
      },
      {
        number: "299",
        title: "Culpable homicide",
        description: "Definition of culpable homicide",
        content: "Whoever causes death by doing an act with the intention of causing death, or with the intention of causing such bodily injury as is likely to cause death, or with the knowledge that he is likely by such act to cause death, commits the offence of culpable homicide."
      },
      {
        number: "300",
        title: "Murder",
        description: "Definition of murder",
        content: "Culpable homicide is murder if the act by which the death is caused is done with the intention of causing death, or with the intention of causing such bodily injury as the offender knows to be likely to cause the death of the person to whom the harm is caused."
      },
      {
        number: "302",
        title: "Punishment for murder",
        description: "Death penalty or life imprisonment for murder",
        content: "Whoever commits murder shall be punished with death, or imprisonment for life, and shall also be liable to fine."
      },
      {
        number: "304",
        title: "Punishment for culpable homicide not amounting to murder",
        description: "Lesser punishment for culpable homicide",
        content: "Whoever commits culpable homicide not amounting to murder shall be punished with imprisonment for life, or imprisonment of either description for a term which may extend to ten years, and shall also be liable to fine."
      },
      {
        number: "354",
        title: "Assault or criminal force to woman with intent to outrage her modesty",
        description: "Punishment for outraging modesty of women",
        content: "Whoever assaults or uses criminal force to any woman, intending to outrage or knowing it to be likely that he will thereby outrage her modesty, shall be punished with imprisonment of either description for a term which shall not be less than one year but which may extend to five years, and shall also be liable to fine."
      },
      {
        number: "375",
        title: "Rape",
        description: "Definition of rape",
        content: "A man is said to commit rape if he has sexual intercourse with a woman under circumstances falling under any of the seven descriptions enumerated in this section, including without her consent, with her consent obtained under fear of death or hurt, or when she is unable to understand the nature of the act."
      },
      {
        number: "376",
        title: "Punishment for rape",
        description: "Rigorous imprisonment not less than 10 years for rape",
        content: "Whoever commits rape shall be punished with rigorous imprisonment of either description for a term which shall not be less than ten years, but which may extend to imprisonment for life, and shall also be liable to fine."
      },
      {
        number: "378",
        title: "Theft",
        description: "Definition of theft",
        content: "Whoever, intending to take dishonestly any movable property out of the possession of any person without that person's consent, moves that property in order to such taking, is said to commit theft."
      },
      {
        number: "379",
        title: "Punishment for theft",
        description: "Imprisonment up to 3 years or fine or both for theft",
        content: "Whoever commits theft shall be punished with imprisonment of either description for a term which may extend to three years, or with fine, or with both."
      },
      {
        number: "395",
        title: "Punishment for dacoity",
        description: "Life imprisonment or rigorous imprisonment for dacoity",
        content: "Whoever commits dacoity shall be punished with imprisonment for life, or with rigorous imprisonment for a term which may extend to ten years, and shall also be liable to fine."
      },
      {
        number: "415",
        title: "Cheating",
        description: "Definition of cheating",
        content: "Whoever, by deceiving any person, fraudulently or dishonestly induces the person so deceived to deliver any property to any person, or to consent that any person shall retain any property, or intentionally induces the person so deceived to do or omit to do anything which he would not do or omit if he were not so deceived, and which act or omission causes or is likely to cause damage or harm to that person in body, mind, reputation or property, is said to 'cheat'."
      },
      {
        number: "420",
        title: "Cheating and dishonestly inducing delivery of property",
        description: "Punishment for cheating - imprisonment up to 7 years",
        content: "Whoever cheats and thereby dishonestly induces the person deceived to deliver any property to any person, or to make, alter or destroy the whole or any part of a valuable security, shall be punished with imprisonment of either description for a term which may extend to seven years, and shall also be liable to fine."
      },
      {
        number: "499",
        title: "Defamation",
        description: "Making or publishing false imputations harming reputation",
        content: "Whoever, by words either spoken or intended to be read, or by signs or by visible representations, makes or publishes any imputation concerning any person intending to harm, or knowing or having reason to believe that such imputation will harm, the reputation of such person, is said to defame that person."
      },
      {
        number: "500",
        title: "Punishment for defamation",
        description: "Imprisonment up to 2 years or fine or both",
        content: "Whoever defames another shall be punished with simple imprisonment for a term which may extend to two years, or with fine, or with both."
      },
      {
        number: "503",
        title: "Criminal intimidation",
        description: "Threatening to cause injury to person, reputation or property",
        content: "Whoever threatens another with any injury to his person, reputation or property, or to the person or reputation of any one in whom that person is interested, with intent to cause alarm to that person, or to cause that person to do any act which he is not legally bound to do, commits criminal intimidation."
      },
      {
        number: "511",
        title: "Punishment for attempting to commit offences",
        description: "Attempt to commit offence punishable",
        content: "Whoever attempts to commit an offence punishable by this Code with imprisonment for life or imprisonment, or to cause such an offence to be committed, and in such attempt does any act towards the commission of the offence, shall be punished with imprisonment for a term which may extend to one-half of the longest term of imprisonment provided for that offence."
      }
    ]
  },
  {
    id: "cpc",
    name: "Code of Civil Procedure",
    fullName: "The Code of Civil Procedure, 1908",
    year: "1908",
    category: "Civil Law",
    description: "Governs civil court procedures, jurisdiction, and execution of decrees",
    enactedDate: "1 January 1909",
    lastAmended: "2022",
    objectives: [
      "To consolidate and amend the laws relating to the procedure of Courts of Civil Judicature",
      "To ensure speedy disposal of civil cases",
      "To provide for jurisdiction of civil courts",
      "To regulate execution of civil decrees and orders"
    ],
    sections: [
      {
        number: "9",
        title: "Courts to try all civil suits unless barred",
        description: "Jurisdiction of civil courts",
        content: "The Courts shall have jurisdiction to try all suits of a civil nature excepting suits of which their cognizance is either expressly or impliedly barred."
      },
      {
        number: "10",
        title: "Stay of suit",
        description: "Court may stay suit if matter is pending elsewhere",
        content: "No Court shall proceed with the trial of any suit in which the matter in issue is also directly and substantially in issue in a previously instituted suit."
      },
      {
        number: "26",
        title: "Institution of suits",
        description: "How to file a civil suit",
        content: "Every suit shall be instituted by the presentation of a plaint to the Court or to such officer as it appoints in this behalf."
      },
      {
        number: "80",
        title: "Notice to Government",
        description: "Two months' notice required before suing government",
        content: "No suit shall be instituted against the Government until the expiration of two months next after notice in writing has been delivered to the appropriate authority."
      },
      {
        number: "96",
        title: "Examination of witnesses",
        description: "Court's power to examine witnesses",
        content: "The Court may examine such witnesses as it thinks fit, and the parties or their pleaders shall be entitled to cross-examine them."
      },
      {
        number: "100",
        title: "Second appeal",
        description: "Appeal on substantial question of law",
        content: "Save as otherwise expressly provided in the body of this Code or by any other law for the time being in force, an appeal shall lie to the High Court from every decree passed in appeal by any Court subordinate to the High Court, if the High Court is satisfied that the case involves a substantial question of law."
      },
      {
        number: "115",
        title: "Revision",
        description: "High Court's revisional jurisdiction",
        content: "The High Court may call for the record of any case which has been decided by any Court subordinate to such High Court and in which no appeal lies thereto, and if such subordinate Court appears to have exercised a jurisdiction not vested in it by law, or to have failed to exercise a jurisdiction so vested, or to have acted in the exercise of its jurisdiction illegally or with material irregularity, the High Court may make such order in the case as it thinks fit."
      },
      {
        number: "151",
        title: "Inherent powers of Court",
        description: "Court's power to make orders to prevent abuse of process",
        content: "Nothing in this Code shall be deemed to limit or otherwise affect the inherent power of the Court to make such orders as may be necessary for the ends of justice or to prevent abuse of the process of the Court."
      }
    ]
  },
  {
    id: "rte-act",
    name: "Right to Education Act",
    fullName: "The Right of Children to Free and Compulsory Education Act, 2009",
    year: "2009",
    category: "Education",
    description: "Provides free and compulsory education to children aged 6-14 years",
    enactedDate: "1 April 2010",
    lastAmended: "2019",
    objectives: [
      "To provide free and compulsory education to all children aged 6 to 14 years",
      "To ensure quality elementary education",
      "To promote social justice and equality in education",
      "To make education a fundamental right"
    ],
    sections: [
      {
        number: "3",
        title: "Right of child to free and compulsory education",
        description: "Every child has right to elementary education",
        content: "Every child of the age of six to fourteen years shall have a right to free and compulsory elementary education in a neighbourhood school till completion of elementary education."
      },
      {
        number: "12",
        title: "Extent of school to be specified",
        description: "Types of schools covered under RTE",
        content: "For the purposes of this Act, a school means any recognised school imparting elementary education and includes a school established, owned, controlled or substantially financed by the appropriate Government or local authority."
      },
      {
        number: "13",
        title: "No capitation fee and screening procedure for admission",
        description: "Prohibition of capitation fees and entrance tests",
        content: "No school or person shall, while admitting a child, collect any capitation fee and subject the child or his or her parents or guardians to any screening procedure."
      },
      {
        number: "15",
        title: "Proof of age for admission",
        description: "Age determination for school admission",
        content: "For the purpose of admission to elementary education, the age of a child shall be determined on the basis of the birth certificate or on the basis of such other document as may be prescribed."
      },
      {
        number: "19",
        title: "Pupil-teacher ratio",
        description: "Maximum students per teacher",
        content: "The pupil-teacher ratio shall be thirty students per teacher for primary classes and thirty-five students per teacher for upper primary classes."
      },
      {
        number: "23",
        title: "Minimum qualifications for teachers",
        description: "Required qualifications for teaching",
        content: "Any person possessing such minimum qualifications as laid down by the National Council for Teacher Education shall be eligible for appointment as a teacher."
      },
      {
        number: "24",
        title: "Prohibition of deployment of teachers for non-educational purposes",
        description: "Teachers cannot be used for non-teaching work",
        content: "No teacher shall be deployed for any non-educational purposes other than decennial population census, disaster relief duties or duties relating to elections to the local authority or the State Legislatures or Parliament."
      },
      {
        number: "29",
        title: "Curriculum and evaluation procedure",
        description: "Child-friendly curriculum required",
        content: "The curriculum and the evaluation procedure shall be laid down by the appropriate Government on the recommendation of the National Council of Educational Research and Training and the State Council of Educational Research and Training, which shall conform to the values enshrined in the Constitution and which shall be based on the principle of learning through activities, discovery and exploration in a child friendly and child centered manner."
      },
      {
        number: "30",
        title: "Examination and completion certificate",
        description: "No detention policy and completion certificate",
        content: "No child admitted in a school shall be required to pass any Board examination till completion of elementary education. Every child completing elementary education shall be awarded a certificate in such form and in such manner as may be prescribed."
      }
    ]
  },
  {
    id: "it-act",
    name: "Information Technology Act",
    fullName: "The Information Technology Act, 2000",
    year: "2000",
    category: "Cyber Law",
    description: "Provides legal framework for electronic governance and addresses cybercrimes",
    enactedDate: "17 October 2000",
    lastAmended: "2021",
    objectives: [
      "To provide legal recognition for transactions carried out by electronic means",
      "To facilitate electronic filing of documents with Government agencies",
      "To prevent computer-based crimes",
      "To establish legal framework for e-governance and e-commerce"
    ],
    sections: [
      {
        number: "43",
        title: "Penalty for damage to computer systems",
        description: "Compensation for unauthorized access or damage",
        content: "If any person without permission of the owner destroys, deletes or alters any information residing in a computer resource or diminishes its value or utility or affects it injuriously, he shall be liable to pay damages by way of compensation to the person so affected."
      },
      {
        number: "65",
        title: "Tampering with computer source documents",
        description: "Punishment for altering source code",
        content: "Whoever knowingly or intentionally conceals, destroys or alters or causes another to conceal, destroy or alter any computer source code used for a computer program with the intention of causing damage, shall be punishable with imprisonment up to three years, or with fine which may extend to two lakh rupees, or with both."
      },
      {
        number: "66",
        title: "Computer related offences",
        description: "Hacking and unauthorized access punishable",
        content: "If any person, dishonestly or fraudulently, does any act referred to in section 43, he shall be punishable with imprisonment for a term which may extend to three years or with fine which may extend to five lakh rupees or with both."
      },
      {
        number: "66A",
        title: "Punishment for sending offensive messages (Struck Down)",
        description: "This section was struck down by Supreme Court in 2015",
        content: "Section 66A which punished sending offensive messages through communication service was declared unconstitutional by the Supreme Court in Shreya Singhal v. Union of India (2015) as it violated freedom of speech and expression."
      },
      {
        number: "66B",
        title: "Punishment for dishonestly receiving stolen computer resource",
        description: "Receiving stolen digital property",
        content: "Whoever dishonestly receives or retains any stolen computer resource or communication device knowing or having reason to believe the same to be stolen computer resource or communication device, shall be punished with imprisonment of either description for a term which may extend to three years or with fine which may extend to rupees one lakh or with both."
      },
      {
        number: "66C",
        title: "Punishment for identity theft",
        description: "Using another person's digital identity",
        content: "Whoever, fraudulently or dishonestly makes use of the electronic signature, password or any other unique identification feature of any other person, shall be punished with imprisonment of either description for a term which may extend to three years and shall also be liable to fine which may extend to rupees one lakh."
      },
      {
        number: "66D",
        title: "Punishment for cheating by personation using computer resource",
        description: "Online impersonation and fraud",
        content: "Whoever, by means of any communication device or computer resource cheats by personation, shall be punished with imprisonment of either description for a term which may extend to three years and shall also be liable to fine which may extend to one lakh rupees."
      },
      {
        number: "66E",
        title: "Punishment for violation of privacy",
        description: "Capturing or transmitting private images without consent",
        content: "Whoever, intentionally or knowingly captures, publishes or transmits the image of a private area of any person without his or her consent, under circumstances violating the privacy of that person, shall be punished with imprisonment which may extend to three years or with fine not exceeding two lakh rupees, or with both."
      },
      {
        number: "67",
        title: "Punishment for publishing obscene information",
        description: "Publishing obscene content electronically",
        content: "Whoever publishes or transmits or causes to be published or transmitted in the electronic form, any material which is lascivious or appeals to the prurient interest or tends to deprave and corrupt persons, shall be punished on first conviction with imprisonment of either description for a term which may extend to three years and with fine which may extend to five lakh rupees."
      },
      {
        number: "67A",
        title: "Punishment for publishing sexually explicit material",
        description: "Stronger punishment for sexually explicit content",
        content: "Whoever publishes or transmits material containing sexually explicit act in electronic form shall be punished on first conviction with imprisonment of either description for a term which may extend to five years and with fine which may extend to ten lakh rupees."
      },
      {
        number: "67B",
        title: "Punishment for child pornography",
        description: "Severe punishment for child sexual abuse material",
        content: "Whoever publishes or transmits material depicting children in sexually explicit act in electronic form shall be punished on first conviction with imprisonment of either description for a term which may extend to five years and with fine which may extend to ten lakh rupees and in the event of second or subsequent conviction with imprisonment of either description for a term which may extend to seven years and also with fine which may extend to ten lakh rupees."
      },
      {
        number: "69",
        title: "Power to issue directions for interception or monitoring",
        description: "Government's power to monitor electronic information",
        content: "The Central Government or a State Government or any officer specially authorised may, if satisfied that it is necessary or expedient to do so in the interest of the sovereignty or integrity of India, issue directions for interception or monitoring of any information through any computer resource."
      }
    ]
  },
  {
    id: "posh-act",
    name: "POSH Act",
    fullName: "The Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013",
    year: "2013",
    category: "Women's Rights",
    description: "Prevents and addresses sexual harassment of women at workplace",
    enactedDate: "9 December 2013",
    lastAmended: "2013",
    objectives: [
      "To provide protection against sexual harassment of women at workplace",
      "To prevent and prohibit sexual harassment",
      "To provide for redressal of complaints",
      "To ensure safe working environment for women"
    ],
    sections: [
      {
        number: "2",
        title: "Definitions - Sexual Harassment",
        description: "What constitutes sexual harassment",
        content: "Sexual harassment includes unwelcome sexually determined behaviour such as: (a) physical contact and advances; (b) demand or request for sexual favours; (c) making sexually coloured remarks; (d) showing pornography; (e) any other unwelcome physical, verbal or non-verbal conduct of sexual nature."
      },
      {
        number: "3",
        title: "Prevention of sexual harassment",
        description: "Prohibition of sexual harassment",
        content: "No woman shall be subjected to sexual harassment at any workplace."
      },
      {
        number: "4",
        title: "Constitution of Internal Complaints Committee",
        description: "Mandatory committee in every workplace",
        content: "Every employer of a workplace shall constitute an Internal Complaints Committee (ICC) at each office or branch with 10 or more employees. The ICC shall consist of: (a) a Presiding Officer who is a woman employed at a senior level; (b) not less than two Members from amongst employees committed to the cause of women; (c) one external Member from amongst NGOs or associations committed to women's cause."
      },
      {
        number: "9",
        title: "Complaint of sexual harassment",
        description: "How to file a complaint",
        content: "Any aggrieved woman may make a complaint of sexual harassment at workplace in writing to the Internal Committee within a period of three months from the date of incident. The ICC may extend the time limit by another three months for reasons to be recorded in writing."
      },
      {
        number: "13",
        title: "Inquiry into complaint",
        description: "Investigation process",
        content: "The Internal Committee shall complete the inquiry within a period of ninety days from the date of receipt of the complaint."
      },
      {
        number: "19",
        title: "Duties of employer",
        description: "Employer's responsibilities",
        content: "Every employer shall: (a) provide a safe working environment; (b) display the penal consequences of sexual harassment; (c) organize workshops and awareness programmes; (d) assist in securing the attendance of respondent and witnesses; (e) make available necessary facilities to the Internal Committee; (f) assist the woman if she chooses to file a complaint in relation to the offence under the Indian Penal Code."
      },
      {
        number: "26",
        title: "Penalty for non-compliance",
        description: "Punishment for not complying with the Act",
        content: "Any employer who fails to constitute an Internal Committee or comply with any provisions of this Act shall be punishable with fine which may extend to fifty thousand rupees."
      }
    ]
  },
  {
    id: "pocso-act",
    name: "POCSO Act",
    fullName: "The Protection of Children from Sexual Offences Act, 2012",
    year: "2012",
    category: "Child Protection",
    description: "Protects children from sexual abuse, harassment, and pornography",
    enactedDate: "14 November 2012",
    lastAmended: "2019",
    objectives: [
      "To protect children from offences of sexual assault, sexual harassment and pornography",
      "To establish Special Courts for trial of such offences",
      "To provide for matters connected therewith or incidental thereto",
      "To safeguard the interests and well-being of the child"
    ],
    sections: [
      {
        number: "2",
        title: "Definitions - Child",
        description: "Any person below 18 years",
        content: "A 'child' means any person below the age of eighteen years."
      },
      {
        number: "3",
        title: "Penetrative sexual assault",
        description: "Definition of serious sexual assault on child",
        content: "A person is said to commit penetrative sexual assault if he penetrates his penis or any object into the vagina, mouth, urethra or anus of a child."
      },
      {
        number: "4",
        title: "Punishment for penetrative sexual assault",
        description: "Minimum 10 years imprisonment",
        content: "Whoever commits penetrative sexual assault shall be punished with imprisonment of either description for a term which shall not be less than ten years but which may extend to imprisonment for life, and shall also be liable to fine."
      },
      {
        number: "5",
        title: "Aggravated penetrative sexual assault",
        description: "More serious forms of assault",
        content: "Aggravated penetrative sexual assault includes assault by police officer, armed forces, public servant, relative, or assault causing grievous hurt or mental illness to the child."
      },
      {
        number: "6",
        title: "Punishment for aggravated penetrative sexual assault",
        description: "Minimum 20 years to life imprisonment",
        content: "Whoever commits aggravated penetrative sexual assault shall be punished with rigorous imprisonment for a term which shall not be less than twenty years, but which may extend to imprisonment for life, and shall be liable to fine. In case death occurs, punishment shall be life imprisonment or death penalty."
      },
      {
        number: "11",
        title: "Sexual harassment of the child",
        description: "Definition of sexual harassment",
        content: "A person is said to commit sexual harassment upon a child when such person with sexual intent: (a) utters any word or makes any sound, or makes any gesture with the intention that such word or sound shall be heard, or such gesture shall be seen by the child; (b) exhibits any object to a child with the intention that such object shall be seen by the child; (c) shows any object in any form or media for pornographic purposes to the child."
      },
      {
        number: "14",
        title: "Use of child for pornographic purposes",
        description: "Child pornography offence",
        content: "Whoever uses a child for pornographic purposes shall be punished with imprisonment which may extend to five years and with fine."
      },
      {
        number: "15",
        title: "Storage of pornographic material involving child",
        description: "Possession of child sexual abuse material",
        content: "Any person who stores for commercial purposes any pornographic material in any form involving a child shall be punished with imprisonment which may extend to three years or with fine or with both."
      },
      {
        number: "19",
        title: "Reporting of sexual offences",
        description: "Mandatory reporting requirement",
        content: "Any person who has apprehension that an offence under this Act is likely to be committed or has knowledge that such an offence has been committed, shall provide such information to the Special Juvenile Police Unit or the local police."
      },
      {
        number: "21",
        title: "Procedure for recording statement of child",
        description: "Child-friendly recording of statement",
        content: "The statement of the child shall be recorded at the residence of the child or at the place of his choice in the presence of the parents or any other person in whom the child has trust or confidence."
      },
      {
        number: "33",
        title: "Protection of identity",
        description: "Media cannot disclose child's identity",
        content: "No person shall make any report or present any comments in any media or publish any contents which discloses the identity of the child including his name, address, school, or any other particular which may lead to disclosure of identity of the child."
      }
    ]
  },
  {
    id: "domestic-violence-act",
    name: "Domestic Violence Act",
    fullName: "The Protection of Women from Domestic Violence Act, 2005",
    year: "2005",
    category: "Women's Rights",
    description: "Protects women from domestic violence and provides relief and rehabilitation",
    enactedDate: "26 October 2006",
    lastAmended: "2005",
    objectives: [
      "To provide for more effective protection of the rights of women guaranteed under the Constitution who are victims of violence of any kind occurring within the family",
      "To provide for matters connected therewith or incidental thereto",
      "To ensure right to reside in the shared household",
      "To provide immediate relief and support to victims"
    ],
    sections: [
      {
        number: "2",
        title: "Definitions - Aggrieved person",
        description: "Who can file complaint",
        content: "'Aggrieved person' means any woman who is, or has been, in a domestic relationship with the respondent and who alleges to have been subjected to any act of domestic violence by the respondent."
      },
      {
        number: "3",
        title: "Definition of domestic violence",
        description: "What constitutes domestic violence",
        content: "Any act, omission or commission or conduct of the respondent shall constitute domestic violence in case it: (a) harms or injures or endangers the health, safety, life, limb or well-being, whether mental or physical, of the aggrieved person; (b) harasses, harms, injures or endangers the aggrieved person with a view to coerce her to meet any unlawful demand for any dowry; (c) has the effect of threatening the aggrieved person; (d) otherwise injures or causes harm, whether physical or mental, to the aggrieved person."
      },
      {
        number: "12",
        title: "Application to Magistrate",
        description: "How to seek protection",
        content: "An aggrieved person or a Protection Officer or any other person on behalf of the aggrieved person may present an application to the Magistrate seeking one or more reliefs under this Act."
      },
      {
        number: "17",
        title: "Right to reside in a shared household",
        description: "Woman's right to continue living in matrimonial home",
        content: "Every woman in a domestic relationship shall have the right to reside in the shared household, whether or not she has any right, title or beneficial interest in the same. The aggrieved person shall not be evicted or excluded from the shared household except in accordance with the procedure established by law."
      },
      {
        number: "18",
        title: "Protection orders",
        description: "Court can prohibit respondent from committing violence",
        content: "The Magistrate may pass a protection order prohibiting the respondent from: (a) committing any act of domestic violence; (b) aiding or abetting in the commission of acts of domestic violence; (c) entering the place of employment of the aggrieved person; (d) attempting to communicate with the aggrieved person; (e) alienating any assets used by both parties; (f) causing violence to dependents or relatives of the aggrieved person."
      },
      {
        number: "19",
        title: "Residence orders",
        description: "Orders regarding shared household",
        content: "The Magistrate may pass a residence order: (a) restraining the respondent from dispossessing the aggrieved person from the shared household; (b) directing the respondent to remove himself from the shared household; (c) restraining the respondent from entering the shared household; (d) directing the respondent to secure same level of alternate accommodation for the aggrieved person."
      },
      {
        number: "20",
        title: "Monetary reliefs",
        description: "Financial support to victim",
        content: "The Magistrate may direct the respondent to pay monetary relief to meet the expenses incurred and losses suffered by the aggrieved person including: (a) loss of earnings; (b) medical expenses; (c) loss caused due to the destruction of property; (d) maintenance for the aggrieved person and her children; (e) custody of the child."
      },
      {
        number: "22",
        title: "Custody orders",
        description: "Child custody arrangements",
        content: "The Magistrate may grant temporary custody of any child to the aggrieved person or the person making an application on her behalf and specify the arrangements for visit of such child by the respondent."
      },
      {
        number: "31",
        title: "Penalty for breach of protection order by respondent",
        description: "Imprisonment for violating court orders",
        content: "A breach of protection order, or of an interim protection order, by the respondent shall be an offence and shall be punishable with imprisonment of either description for a term which may extend to one year, or with fine which may extend to twenty thousand rupees, or with both."
      }
    ]
  }
];
